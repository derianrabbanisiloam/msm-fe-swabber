import { Component, OnInit, Input} from '@angular/core';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleService } from '../../../services/schedule.service';
import { ScheduleBlock } from '../../../models/schedules/schedule-block';
import { 
  addScheduleBlockPayload, updateScheduleBlockPayload, deleteScheduleBlockPayload
} from '../../../payloads/schedule-block.payload';
import { sourceApps } from '../../../variables/common.variable';


@Component({
  selector: 'app-modal-schedule-block',
  templateUrl: './modal-schedule-block.component.html',
  styleUrls: ['./modal-schedule-block.component.css']
})
export class ModalScheduleBlockComponent implements OnInit {

  @Input() inputedParams: any;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public blockModel: any = {};
  public hourOptions: any = ['07', '08', '09', '10', '11', 
                              '12', '13', '14', '15', '16', 
                              '17', '18', '19', '20', '21', '22', '23'];
  public minuteOptions: any = ['00', '30'];
  public scheduleBlocks: ScheduleBlock[];
  public addSchBlockPayload: addScheduleBlockPayload;
  public updateSchBlockPayload: updateScheduleBlockPayload;
  public deleteSchBlockPayload: deleteScheduleBlockPayload;
  public isValidBlock: boolean = false;
  public addBlockErrMsg: string;
  public editBlockErrMsg: string;
  public userId: string = this.user.id;
  private userName: string = this.user.fullname;
  public source: string = sourceApps;
  public schBlockSelected: any;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    this.getScheduleBlock();
  }

  getScheduleBlock() {
    const scheduleId = this.inputedParams.scheduleId;
    const date = this.inputedParams.date;
    this.scheduleService.getScheduleBlock(scheduleId, date).subscribe(
      data => {
        this.scheduleBlocks = data.data;
        let ft: any;
        let tt: any;
        for (let i=0; i<this.scheduleBlocks.length; i++) {
          ft = this.scheduleBlocks[i].from_time.split(':');
          tt = this.scheduleBlocks[i].to_time.split(':');
          this.scheduleBlocks[i].fh = ft[0];
          this.scheduleBlocks[i].fm = ft[1];
          this.scheduleBlocks[i].th = tt[0];
          this.scheduleBlocks[i].tm = tt[1];
        }
      }
    );    
  }

  async addScheduleBlock() {
    const scheduleId = this.inputedParams.scheduleId;
    const date = this.inputedParams.date;
    const fromTime = moment('1990-01-01 ' + this.blockModel.fh + ':' + this.blockModel.fm).format('HH:mm');
    const toTime = moment('1990-01-01 ' + this.blockModel.th + ':' + this.blockModel.tm).format('HH:mm');
    const { reason, isIncludeWaitingList } = this.blockModel;
    this.addSchBlockPayload = {
      fromDate: date,
      toDate: date,
      fromTime: fromTime,
      toTime: toTime,
      reason: reason,
      isIncludeWaitingList: isIncludeWaitingList, 
      userId: this.userId,
      userName: this.userName,
      source: this.source,
    };
    console.log(this.addSchBlockPayload, 'ini');
    await this.scheduleService.addScheduleBlock(scheduleId, this.addSchBlockPayload).toPromise().then(
      data => {
        this.scheduleService.emitScheduleBlock(true);
        console.log(data);
      }
    );
    this.getScheduleBlock();
  }

  async updateScheduleBlock() {
    const scheduleBlockId = this.schBlockSelected.schedule_block_id;
    const fromDate = this.schBlockSelected.from_date;
    const toDate = this.schBlockSelected.to_date;
    const fromTime = moment('1990-01-01 ' + this.schBlockSelected.fh + ':' + this.schBlockSelected.fm).format('HH:mm');
    const toTime = moment('1990-01-01 ' + this.schBlockSelected.th + ':' + this.schBlockSelected.tm).format('HH:mm');
    const reason = this.schBlockSelected.reason;
    const isIncludeWaitingList = this.schBlockSelected.is_include_waiting_list;
    this.updateSchBlockPayload = {
      fromDate: fromDate,
      toDate: toDate,
      fromTime: fromTime,
      toTime: toTime,
      reason: reason,
      isIncludeWaitingList: isIncludeWaitingList, 
      userId: this.userId,
      userName: this.userName,
      source: this.source,
    };
    await this.scheduleService.updateScheduleBlock(scheduleBlockId, this.updateSchBlockPayload).toPromise().then(
      data => {
        this.scheduleService.emitScheduleBlock(true);
        console.log(data);
      }
    );
    this.getScheduleBlock();
  }

  async deleteScheduleBlock() {
    const scheduleBlockId = this.schBlockSelected.schedule_block_id;
    this.deleteSchBlockPayload = {
      userId: this.userId,
      userName: this.userName,
      source: this.source,
    };
    await this.scheduleService.deleteScheduleBlock(scheduleBlockId, this.deleteSchBlockPayload).toPromise().then(
      data => {
        this.scheduleService.emitScheduleBlock(true);
        this.getScheduleBlock();
      }
    );
  }

  openModalBlockConfirmation(content, data) {
    this.schBlockSelected = data;
    this.modalService.open(content);
  }

  close() {
    this.activeModal.close();
  }

  blockCheckBox(e) {
    this.blockModel.isIncludeWaitingList = this.blockModel.isIncludeWaitingList ? true : false;
  }

  blockCheckBoxEdit(i) {
    this.scheduleBlocks[i].is_include_waiting_list = this.scheduleBlocks[i].is_include_waiting_list ? true : false;
  }

  checkBlockTime() {
    if (this.blockModel.fh && this.blockModel.fm && this.blockModel.th && this.blockModel.tm) {
      const ft = moment('1990-01-01 ' + this.blockModel.fh + ':' + this.blockModel.fm).format('HH:mm');
      const tt = moment('1990-01-01 ' + this.blockModel.th + ':' + this.blockModel.tm).format('HH:mm');
      if (ft >= tt) {
        this.addBlockErrMsg = 'From Time tidak boleh lebih besar dari To Time !';
        this.editBlockErrMsg = '';
        this.isValidBlock = false;
      }
      else {
        this.addBlockErrMsg = '';
        this.editBlockErrMsg = '';
        this.isValidBlock = true;
      }
    }
  }

}

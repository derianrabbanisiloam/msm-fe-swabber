import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleService } from '../../../services/schedule.service';
import { ScheduleBlock } from '../../../models/schedules/schedule-block';
import {
  addScheduleBlockPayload, updateScheduleBlockPayload, deleteScheduleBlockPayload
} from '../../../payloads/schedule-block.payload';
import { sourceApps } from '../../../variables/common.variable';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { environment } from '../../../../environments/environment';
import socket from 'socket.io-client';
import { SecretKey, Jwt, keySocket, SCHEDULE_BLOCK } from '../../../variables/common.variable';
import Security from 'msm-kadapat';

@Component({
  selector: 'app-modal-schedule-block',
  templateUrl: './modal-schedule-block.component.html',
  styleUrls: ['./modal-schedule-block.component.css']
})
export class ModalScheduleBlockComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  @Input() inputedParams: any;
  public alerts: Alert[] = [];
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public blockModel: any = {};
  public hourOptions: any = ['07', '08', '09', '10', '11',
    '12', '13', '14', '15', '16',
    '17', '18', '19', '20', '21', '22', '23'];
  public minuteOptions: any = ['00', '30'];
  public scheduleBlocks: any = [];
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
  private socket;
  private index: any;
  private undoWaitingList: boolean = false;
  private undoTeleconsultation: boolean = false;
  public scheduleSel: string;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private scheduleService: ScheduleService,
    private alertService: AlertService,
  ) {
    this.socket = socket(environment.WEB_SOCKET_SERVICE + keySocket.SCHEDULE, {
      'force new connection': true,
      transports: ['websocket'],  
      query: `data=${
        Security.encrypt({ secretKey: SecretKey }, Jwt)
        }&url=${environment.FRONT_OFFICE_SERVICE}`,
    });
   }

  ngOnInit() {
    this.getScheduleBlock();
    this.getCollectionAlert();
  }

  getScheduleBlock() {
    const date = this.inputedParams.date;
    const hospitalId = this.hospital.id;
    const doctorId = this.inputedParams.doctorId;
    this.scheduleService.getScheduleBlockByDay(hospitalId, doctorId, date).subscribe(
      data => {
        this.scheduleBlocks = [];
        if(data.data.length !== 0) {
          let result = data.data;
          let ft: any;
          let tt: any;
          for(let i = 0, { length } = this.inputedParams.scheduleId; i < length; i += 1) {
            this.scheduleBlocks.push(
              {
                schedule_id: this.inputedParams.scheduleId[i].schedule_id,
                schedule_time: this.inputedParams.scheduleId[i].from_time+" - "+this.inputedParams.scheduleId[i].to_time,
                schedule_block: []
              }
            )

            for(let j = 0, { length } = result; j < length; j += 1) {
              if(this.scheduleBlocks[i].schedule_id === result[j].schedule_id) {
                ft = result[j].from_time.split(':');
                tt = result[j].to_time.split(':');
                this.scheduleBlocks[i].schedule_block.push({
                  ...result[j],
                  fh: ft[0],
                  fm: ft[1],
                  th: tt[0],
                  tm: tt[1]
                })
              }
            }
          }
        }
      }, error => {
        this.alertService.error(error.error.message, false, 3000);
      }
    );
  }

  rangeTimeChecker(fromTime, toTime, scheduleId) {
    const fSplit = fromTime.split(':');
    const tSplit = toTime.split(':');
    const setFT = new Date(this.inputedParams.date).setUTCHours(fSplit[0], fSplit[1], 0, 0);
    const setTT = new Date(this.inputedParams.date).setUTCHours(tSplit[0], tSplit[1], 0, 0);
    let ft: any;
    let tt: any;
    let fTime: any;
    let tTime: any;
    let found: boolean = false;
    for(let i = 0, { length } = this.scheduleBlocks; i < length; i += 1) {
      if(this.scheduleBlocks[i].schedule_id === scheduleId) {
        for (let j = 0; j < this.scheduleBlocks[i].schedule_block.length; j++) {
          ft = this.scheduleBlocks[i].schedule_block[j].from_time.split(':');
          tt = this.scheduleBlocks[i].schedule_block[j].to_time.split(':');
          fTime = new Date(this.inputedParams.date).setUTCHours(ft[0], ft[1], 0, 0);
          tTime = new Date(this.inputedParams.date).setUTCHours(tt[0], tt[1], 0, 0);
          if (((setFT >= fTime) && (setFT < tTime)) || ((setTT > fTime) && (setTT <= tTime))) {
            found = true;
          }
        }
        return found;
      }
    }
  }

  rangeTimeCheckerSchedule(fromTime, toTime, scheduleId) {
    const fSplit = fromTime.split(':');
    const tSplit = toTime.split(':');
    const setFT = new Date(this.inputedParams.date).setUTCHours(fSplit[0], fSplit[1], 0, 0);
    const setTT = new Date(this.inputedParams.date).setUTCHours(tSplit[0], tSplit[1], 0, 0);
    let ft: any;
    let tt: any;
    let fTime: any;
    let tTime: any;
    let found: boolean = false;
    for(let i = 0, { length } = this.inputedParams.scheduleId; i < length; i += 1) {
      if(this.inputedParams.scheduleId[i].schedule_id === scheduleId) {
        ft = this.inputedParams.scheduleId[i].from_time.split(':');
        tt = this.inputedParams.scheduleId[i].to_time.split(':');
        fTime = new Date(this.inputedParams.date).setUTCHours(ft[0], ft[1], 0, 0);
        tTime = new Date(this.inputedParams.date).setUTCHours(tt[0], tt[1], 0, 0);
        if((setFT < fTime) || (setTT > tTime)) {
          found = true;
        }
        return found;
      }
    }
  }

  async addScheduleBlock() {
    const scheduleId = this.scheduleSel;
    const date = this.inputedParams.date;
    const fromTime = moment('1990-01-01 ' + this.blockModel.fh + ':' + this.blockModel.fm).format('HH:mm');
    const toTime = moment('1990-01-01 ' + this.blockModel.th + ':' + this.blockModel.tm).format('HH:mm');
    const checkTime = await this.rangeTimeChecker(fromTime, toTime, this.scheduleSel);
    const checkScheduleTime = await this.rangeTimeCheckerSchedule(fromTime, toTime, this.scheduleSel);

    if (checkTime) {
      this.addBlockErrMsg = 'This range time already exist, please select another range time !';
    } 
    else if(checkScheduleTime) {
      this.addBlockErrMsg = 'Out of range time schedule, please select another range time !';
    }
    else {
      const { reason, isIncludeWaitingList, isTeleconsultation } = this.blockModel;
      this.addSchBlockPayload = {
        fromDate: date,
        toDate: date,
        fromTime: fromTime,
        toTime: toTime,
        reason: reason,
        isIncludeWaitingList: isIncludeWaitingList,
        isTeleconsultation: isTeleconsultation,
        userId: this.userId,
        userName: this.userName,
        source: this.source,
      };

      await this.scheduleService.addScheduleBlock(scheduleId, this.addSchBlockPayload).toPromise().then(
        data => {
          let dataScheduleBlock = {...data.data};
          dataScheduleBlock.method = 'post';
          dataScheduleBlock.hospitalId = this.hospital.id;
          this.socket.emit(SCHEDULE_BLOCK, dataScheduleBlock);
          this.scheduleService.emitScheduleBlock(true);
          this.alertService.success('Schedule Blocks Added', false, 3000);
        }, error => {
          this.alertService.error(error.error.message, false, 3000);
        }
      );
      this.getScheduleBlock();
    }
  }

  async updateScheduleBlock() {
    const scheduleBlockId = this.schBlockSelected.schedule_block_id;
    const fromDate = this.schBlockSelected.from_date;
    const toDate = this.schBlockSelected.to_date;
    const fromTime = moment('1990-01-01 ' + this.schBlockSelected.fh + ':' + this.schBlockSelected.fm).format('HH:mm');
    const toTime = moment('1990-01-01 ' + this.schBlockSelected.th + ':' + this.schBlockSelected.tm).format('HH:mm');
    const reason = this.schBlockSelected.reason;
    const isIncludeWaitingList = this.schBlockSelected.is_include_waiting_list;
    const isTeleconsultation = this.schBlockSelected.is_teleconsultation;
    this.checkBlockTime2(this.schBlockSelected.fh, this.schBlockSelected.fm, this.schBlockSelected.th, this.schBlockSelected.tm);

    if (this.isValidBlock == true) {
      this.updateSchBlockPayload = {
        scheduleId: this.schBlockSelected.schedule_id,
        fromDate: fromDate,
        toDate: toDate,
        fromTime: fromTime,
        toTime: toTime,
        reason: reason,
        isIncludeWaitingList: isIncludeWaitingList,
        isTeleconsultation: isTeleconsultation,
        userId: this.userId,
        userName: this.userName,
        source: this.source,
      };
      await this.scheduleService.updateScheduleBlock(scheduleBlockId, this.updateSchBlockPayload).toPromise().then(
        data => {
          this.undoWaitingList = false;
          this.undoTeleconsultation = false;
          let dataScheduleBlock = {...data.data};
          dataScheduleBlock.method = 'put';
          dataScheduleBlock.hospitalId = this.hospital.id;
          this.socket.emit(SCHEDULE_BLOCK, dataScheduleBlock);
          this.scheduleService.emitScheduleBlock(true);
          this.alertService.success('Schedule Blocks Updated', false, 3000);
        }, error => {
          if(this.undoWaitingList === true) {
            this.undoWaitingList = false;
            this.scheduleBlocks[this.index].is_include_waiting_list = this.scheduleBlocks[this.index].is_include_waiting_list ? false : true;
          } else if(this.undoTeleconsultation === true) {
            this.undoTeleconsultation = false;
            this.scheduleBlocks[this.index].is_teleconsultation = this.scheduleBlocks[this.index].is_teleconsultation ? false : true;
          }
          this.alertService.error(error.error.message, false, 3000);
        }
      );
      this.getScheduleBlock();
    }
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
        let dataScheduleBlock = {...data.data};
        dataScheduleBlock.method = 'delete';
        dataScheduleBlock.hospitalId = this.hospital.id;
        this.socket.emit(SCHEDULE_BLOCK, dataScheduleBlock);
        this.scheduleService.emitScheduleBlock(true);
        this.alertService.success('Schedule Blocks Deleted', false, 3000);
        this.getScheduleBlock();
      }, error => {
        this.alertService.error(error.error.message, false, 3000);
      }
    );
  }

  openModalBlockConfirmation(content, data, i) {
    this.index = i;
    this.schBlockSelected = data;
    this.modalService.open(content);
  }

  close() {
    this.activeModal.close();
  }

  blockCheckBox(e) {
    this.blockModel.isIncludeWaitingList = this.blockModel.isIncludeWaitingList ? true : false;
  }

  blockCheckBoxTwo(e) {
    this.blockModel.isTeleconsultation = this.blockModel.isTeleconsultation ? true : false;
  }

  blockCheckBoxEdit() {
    this.undoWaitingList = true;
  }

  blockCheckBoxEditTwo() {
    this.undoTeleconsultation = true;
  }

  cancelCheckBox() {
    for(let i = 0, { length } = this.scheduleBlocks; i < length; i += 1) {
      if(this.scheduleBlocks[i].schedule_id === this.schBlockSelected.schedule_id) {
        if(this.undoWaitingList === true) {
          this.undoWaitingList = false;
          this.scheduleBlocks[i].schedule_block[this.index].is_include_waiting_list = this.scheduleBlocks[i].schedule_block[this.index].is_include_waiting_list ? false : true;
        } else if(this.undoTeleconsultation === true) {
          this.undoTeleconsultation = false;
          this.scheduleBlocks[i].schedule_block[this.index].is_teleconsultation = this.scheduleBlocks[i].schedule_block[this.index].is_teleconsultation ? false : true;
        }
      }
    }
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

  checkBlockTime2(fh, fm, th, tm) {
    if (fh && fm && th && tm) {
      const ft = moment('1990-01-01 ' + fh + ':' + fm).format('HH:mm');
      const tt = moment('1990-01-01 ' + th + ':' + tm).format('HH:mm');
      if (ft >= tt) {
        this.editBlockErrMsg = 'From Time tidak boleh lebih besar dari To Time !';
        this.isValidBlock = false;
      }
      else {
        this.editBlockErrMsg = '';
        this.isValidBlock = true;
      }
    }
  }

  async getCollectionAlert() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }
      // add alert to array
      this.alerts.push(alert);
    });
  }

  cssAlertType(alert: Alert) {
    if (!alert) {
      return;
    }

    switch (alert.type) {
      case AlertType.Success:
        return 'success';
      case AlertType.Error:
        return 'danger';
      case AlertType.Info:
        return 'info';
      case AlertType.Warning:
        return 'warning';
    }
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

}

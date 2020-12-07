import { Component, OnInit } from '@angular/core';
import { BpjsService } from '../../../services/bpjs.service';
import { AppointmentService } from '../../../services/appointment.service';
import socket from 'socket.io-client';
import { SecretKey, Jwt, REQUEST_LIST,
        APP_TELE_AIDO, keySocket, hospitalId } from '../../../variables/common.variable';
import Security from 'msm-kadapat';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-section-sidebar',
  templateUrl: './section-sidebar.component.html',
  styleUrls: ['./section-sidebar.component.css']
})
export class SectionSidebarComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public countReqList: number = 0;
  public countAidoList: number = 0;
  private socket;
  private socketTwo;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public yogyaHospitalId = hospitalId.yogyakarta;
  public isBpjs = this.key.hospital.isBpjs;
  public dateNow: any = moment().format('YYYY-MM-DD');

  constructor(
    private bpjsService: BpjsService,
    private appointmentService: AppointmentService
  ) {
    this.socket = socket(`${environment.WEB_SOCKET_SERVICE + keySocket.BPJS}`, {
      transports: ['websocket'],
      query: `data=${
        Security.encrypt({ secretKey: SecretKey }, Jwt)
        }&url=${environment.BPJS_SERVICE}`,
    });
    this.socketTwo = socket(`${environment.WEB_SOCKET_SERVICE + keySocket.APPOINTMENT}`, {
      transports: ['websocket'],
      query: `data=${
        Security.encrypt({ secretKey: SecretKey }, Jwt)
        }&url=${environment.CALL_CENTER_SERVICE}`,
    });
    this.countRechedule();
    this.countAido();
  }

  ngOnInit() {
    this.socket.on(REQUEST_LIST+'/'+this.hospital.id, (call) => {
      this.countReqList = call.data;
    });
    this.socketTwo.on(APP_TELE_AIDO+'/'+this.hospital.id, (call) => {
      this.countAidoList = call.data;
    });
  }

  countRechedule() {
    this.bpjsService.getCountReqList(this.hospital.id).subscribe(
      data => {
        this.countReqList = data.data;
      }
    );
  }

  countAido() {
    this.appointmentService.countAidoAppointment(this.hospital.id, this.dateNow, this.dateNow).subscribe(
      data => {
        this.countAidoList = data.data;
      }
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { BpjsService } from '../../../services/bpjs.service';
import { AppointmentService } from '../../../services/appointment.service';
import socket from 'socket.io-client';
import { SecretKey, Jwt, REQUEST_LIST,
        APP_TELE_AIDO, keySocket, hospitalId } from '../../../variables/common.variable';
import Security from 'msm-kadapat';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { WebsocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-section-sidebar',
  templateUrl: './section-sidebar.component.html',
  styleUrls: ['./section-sidebar.component.css']
})
export class SectionSidebarComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public countReqList: number = 0;
  public countAidoList: number = 0;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public yogyaHospitalId = hospitalId.yogyakarta;
  public isBpjs = this.key.hospital.isBpjs;
  public dateNow: any = moment().format('YYYY-MM-DD');

  constructor(
    private bpjsService: BpjsService,
    private appointmentService: AppointmentService,
    private webSocketService: WebsocketService,
  ) {
    this.countRechedule();
    this.countAido();
  }

  ngOnInit() {
    this.webSocketService.bpjsAppSocket(`${REQUEST_LIST}/${this.hospital.id}`).subscribe((call) => {
      this.countReqList = call.data;
    });
    this.webSocketService.appointmentSocket(`${APP_TELE_AIDO}/${this.hospital.id}`).subscribe((call) => {
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

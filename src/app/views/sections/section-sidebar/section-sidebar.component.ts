import { Component, OnInit } from '@angular/core';
import { BpjsService } from '../../../services/bpjs.service';
import { AppointmentService } from '../../../services/appointment.service';
import socket from 'socket.io-client';
import { SecretKey, Jwt, REQUEST_LIST, keySocket } from '../../../variables/common.variable';
import Security from 'msm-kadapat';
import { environment } from '../../../../environments/environment';
import { hospitalId } from '../../../variables/common.variable';
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
    this.countRechedule();
    this.countAido();
  }

  ngOnInit() {
    this.socket.on(REQUEST_LIST+'/'+this.hospital.id, (call) => {
      this.countReqList = call.data;
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

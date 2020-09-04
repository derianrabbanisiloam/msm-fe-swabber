import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import socket from 'socket.io-client';
import { SecretKey, Jwt, REQUEST_LIST, keySocket } from '../../../variables/common.variable';
import Security from 'msm-kadapat';
import { environment } from '../../../../environments/environment';
import { hospitalId } from '../../../variables/common.variable';

@Component({
  selector: 'app-section-sidebar',
  templateUrl: './section-sidebar.component.html',
  styleUrls: ['./section-sidebar.component.css']
})
export class SectionSidebarComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public countReqList: number = 0;
  private socket;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public yogyaHospitalId = hospitalId.yogyakarta;

  constructor(
    private appointmentService: AppointmentService,
  ) {
    this.socket = socket(`${environment.WEB_SOCKET_SERVICE + keySocket.APPOINTMENT}`, {
      transports: ['websocket'],
      query: `data=${
        Security.encrypt({ secretKey: SecretKey }, Jwt)
        }&url=${environment.CALL_CENTER_SERVICE}`,
    });
  }

  ngOnInit() {
    this.socket.on(REQUEST_LIST+'/'+this.hospital.id, (call) => {
      this.countReqList = call.data;
    });
  }

  countRechedule() {
    this.appointmentService.getCountReqList(this.hospital.id).subscribe(
      data => {
        this.countReqList = data.data;
      }
    );
  }

}

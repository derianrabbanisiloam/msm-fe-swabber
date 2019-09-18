import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import socket from 'socket.io-client';
import { SecretKey, Jwt, APP_RESCHEDULE, keySocket } from '../../../variables/common.variable';
import Security from 'msm-kadapat';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-section-sidebar',
  templateUrl: './section-sidebar.component.html',
  styleUrls: ['./section-sidebar.component.css']
})
export class SectionSidebarComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public countAppRes: number;
  private socket;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;

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
    this.countRechedule();
    this.socket.on(APP_RESCHEDULE+'/'+this.hospital.id, (call) => {
      this.countAppRes = call.data;
    });
  }

  countRechedule() {
    this.appointmentService.getCountAppReschedule(this.hospital.id).subscribe(
      data => {
        this.countAppRes = data.data;
      }
    );
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import {
  SecretKey, Jwt, keySocket
} from '../variables/common.variable';
import Security from 'msm-kadapat';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  appSocket: any;
  queSocket: any;
  schSocket: any;
  bpjsSocket: any;
  readonly url: string = environment.WEB_SOCKET_SERVICE;

  constructor() {
    this.appSocket = io(`${this.url}${keySocket.APPOINTMENT}`, {transports: ['websocket'],
                      query: `data=${Security.encrypt({ secretKey: SecretKey }, Jwt)}&url=${environment.CALL_CENTER_SERVICE}`});

    this.queSocket = io(`${this.url}${keySocket.QUEUE}`, {transports: ['websocket'],
                      query: `data=${Security.encrypt({ secretKey: SecretKey }, Jwt)}&url=${environment.FRONT_OFFICE_SERVICE}`});

    this.schSocket = io(`${this.url}${keySocket.SCHEDULE}`, {transports: ['websocket'],
                      query: `data=${Security.encrypt({ secretKey: SecretKey }, Jwt)}&url=${environment.OPADMIN_SERVICE}`});

    this.bpjsSocket = io(`${this.url}${keySocket.BPJS}`, {transports: ['websocket'],
                      query: `data=${Security.encrypt({ secretKey: SecretKey }, Jwt)}&url=${environment.BPJS_SERVICE}`});
   }

  appointmentSocket(eventName: string): Observable<any> {
    return new Observable((subcriber) => {
      this.appSocket.on(eventName, data => {
        subcriber.next(data);
      })
    })
  }

  queueSocket(eventName: string): Observable<any> {
    return new Observable((subcriber) => {
      this.queSocket.on(eventName, (data) => {
        subcriber.next(data);
      })
    })
  }

  scheduleSocket(eventName: string): Observable<any> {
    return new Observable((subcriber) => {
      this.schSocket.on(eventName, (data) => {
        subcriber.next(data);
      })
    })
  }

  bpjsAppSocket(eventName: string): Observable<any> {
    return new Observable((subcriber) => {
      this.bpjsSocket.on(eventName, (data) => {
        subcriber.next(data);
      })
    })
  }

  emitQueueSocket(eventName: string, data: any) {
    this.queSocket.emit(eventName, data);
  }

  emitAppointmentSocket(eventName: string, data: any) {
    this.appSocket.emit(eventName, data);
  }

  emitScheduleSocket(eventName: string, data: any) {
    this.schSocket.emit(eventName, data);
  }

}

import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Appointment} from  '../models/appointments/appointment';
import { environment } from '../../environments/environment';
import { httpOptions } from '../utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class BpjsService {

  constructor(
    private http: HttpClient
  ) { }

  private appointmentBpjsUrl = environment.BPJS_SERVICE + '/appointments';

 getListAppointmentBpjs(
  hospitalId?: string,
  fromDate?: string,
  toDate?: string,
  name?: string,
  doctor?: string,
  offset?: number,
  limit?: number
): Observable<any> {
    let url = `${this.appointmentBpjsUrl}`;
    url = `${this.appointmentBpjsUrl}?from=${fromDate}&to=${toDate}`;
    url = `${url}&limit=${limit}&offset=${offset}`;
    
    return this.http.get<any>(url, httpOptions);
  }

  getAppointmentDetailById(appBpjsId: string): Observable<any> {
    const url = `${this.appointmentBpjsUrl}/${appBpjsId}`;
    return this.http.get<any>(url, httpOptions);
  }

  addAppointmentBpjs(payload: any): Observable<any> {
    return this.http.post<any>(this.appointmentBpjsUrl, payload, httpOptions);
  }

  notifyBpjs(payload: any): Observable<any> {
    const url = `${this.appointmentBpjsUrl}/notify`;
    return this.http.post<any>(url, payload, httpOptions);
  }

  checkNoBpjs(
    hospitalId?: string,
    bpjsCardNumber?: string,
    name?: string,
    birthDate?: string,
    specialityId?: string
    ): Observable<any> {
    let uri = `${this.appointmentBpjsUrl}/references?hospitalId=${hospitalId}`;
    uri = bpjsCardNumber ? `${uri}&bpjsCardNumber=${bpjsCardNumber}` : uri;
    uri = name ? `${uri}&name=${name}` : uri;
    uri = birthDate ? `${uri}&birthDate=${birthDate}` : uri;
    uri = specialityId ? `${uri}&specialityId=${specialityId}` : uri;
    return this.http.get<any>(uri, httpOptions);
  }

  deleteAppointmentBpjs(appointmentId: string, payload: any, temp = false) {
    let url = `${this.appointmentBpjsUrl}`;

    if(temp){
      url = `${url}/temporary/${appointmentId}`;
    }else{
      url = `${url}/${appointmentId}`
    }

    const body = JSON.stringify(payload);
    
    const options = {
      ...httpOptions,
      body,
    };
    
    return this.http.delete<any>(url, options);
  }
}

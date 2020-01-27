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
    // url = `${this.appointmentBpjsUrl}?hospitalId=${hospitalId}&from=${fromDate}&to=${toDate}`;
    // url = name ? `${url}&patientName=${name}` : url;
    // url = doctor ? `${url}&doctorId=${doctor}` : url;
    // url = `${url}&limit=${limit}&offset=${offset}`;
    
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
}

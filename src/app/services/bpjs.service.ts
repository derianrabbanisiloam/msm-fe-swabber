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
  private lakaLantasUrl = environment.BPJS_SERVICE + '/lookups';

  getListAppointmentBpjs(
    hospitalId?: string,
    fromDate?: string,
    toDate?: string,
    name?: string,
    birthDate?: string,
    noBpjs?: string,
    specialty?: string,
    offset?: number,
    limit?: number
  ): Observable<any> {
      let url = `${this.appointmentBpjsUrl}?from=${fromDate}&to=${toDate}`;
      url = hospitalId ? `${url}&hospitalId=${hospitalId}` : url;
      url = name ? `${url}&name=${name}` : url;
      url = birthDate ? `${url}&birthDate=${birthDate}` : url;
      url = noBpjs ? `${url}&bpjsCardNumber=${noBpjs}` : url;
      url = specialty ? `${url}&specialityId=${specialty}` : url;
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
    nationalIdNo?: string,
    name?: string,
    birthDate?: string,
    specialityId?: string
    ): Observable<any> {
    let uri = `${this.appointmentBpjsUrl}/references?hospitalId=${hospitalId}`;
    uri = bpjsCardNumber ? `${uri}&bpjsCardNumber=${bpjsCardNumber}` : uri;
    uri = nationalIdNo ? `${uri}&nationalIdNo=${nationalIdNo}` : uri;
    uri = name ? `${uri}&name=${name}` : uri;
    uri = birthDate ? `${uri}&birthDate=${birthDate}` : uri;
    uri = specialityId ? `${uri}&specialityId=${specialityId}` : uri;
    return this.http.get<any>(uri, httpOptions);
  }

  deleteAppointmentBpjs(appointmentId: string, payload: any) {
    let url = `${this.appointmentBpjsUrl}/${appointmentId}`;

    const body = JSON.stringify(payload);
    
    const options = {
      ...httpOptions,
      body,
    };
    
    return this.http.delete<any>(url, options);
  }

  getProvinceLakaLantas(hospitalId: string): Observable<any> {
    let url = `${this.lakaLantasUrl}/bpjs/province?hospitalId=${hospitalId}`;
    return this.http.get<any>(url, httpOptions);
  }

  getDistrictLakaLantas(hospitalId: string, provinceId: string): Observable<any> {
    let url = `${this.lakaLantasUrl}/bpjs/district/${provinceId}?hospitalId=${hospitalId}`;
    return this.http.get<any>(url, httpOptions);
  }

  getSubDistrictLakaLantas(hospitalId: string, districtId: string): Observable<any> {
    let url = `${this.lakaLantasUrl}/bpjs/sub-district/${districtId}?hospitalId=${hospitalId}`;
    return this.http.get<any>(url, httpOptions);
  }
  
}

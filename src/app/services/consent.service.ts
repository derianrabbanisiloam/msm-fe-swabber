import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Consent } from '../models/consents/consent';
import { ConsentDetail } from '../models/consents/consentDetail';
import { environment } from '../../environments/environment';
import { httpOptions } from '../utils/http.util';
import { AppointmentService } from '../services/appointment.service';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {

  constructor(
    private http: HttpClient,
    private appointmentService: AppointmentService,
  ) { }

  private consentUrl = environment.VACCINE_CONSENT_SERVICE;
  private admissionUrl = environment.FRONT_OFFICE_SERVICE + '/admissions';
  private preregisUrl = environment.FRONT_OFFICE_SERVICE + '/preregistrations';

  getVaccineWorklist(date: any, toDate: string, hospital: string, limit: number, offset: number,
    uniCode?: string, birth?: string, appDate?: string, name?: string, 
    phoneNumber?: string, isPreRegist?: boolean, patientStatus?: string): Observable<any> {

    let uri = `${this.preregisUrl}/worklist/${hospital}?appointmentDate=${date}&toAppointmentDate=${toDate}`;
    uri = uniCode ? `${uri}&uniqueCode=${uniCode}` : uri;
    uri = birth ? `${uri}&birthDate=${birth}` : uri;
    uri = appDate ? `${uri}&appDate=${appDate}` : uri;
    uri = name ? `${uri}&name=${name}` : uri;
    uri = phoneNumber ? `${uri}&phoneNumber=${phoneNumber}` : uri;
    uri = isPreRegist ? `${uri}&isPreRegist=${isPreRegist}` : uri;
    uri = patientStatus ? `${uri}&patientStatus=${patientStatus}` : uri;
    const url = `${uri}&limit=${limit}&offset=${offset}`;
    this.appointmentService.emitUrlDownload(url);
    return this.http.get<any>(url, httpOptions);
  }

  searchConsent(searchType: number, orgId: number, searchText: string,dob: string) {
    const uri = `${this.consentUrl}/consent/${searchType}/${orgId}/${searchText}/${dob}`;
    return this.http.get<any>(uri, httpOptions);
  }

  getDetailAnswer(id: number): Observable<any> {
    const uri = `${this.consentUrl}/consentdetail/${id}`;
    return this.http.get<ConsentDetail[]>(uri, httpOptions);
  }

  updateConsent(payload: any): Observable<any> {
    const url = `${this.consentUrl}/updateconsent`;
    const body = JSON.stringify(payload);

    return this.http.put<any>(url, body, httpOptions);
  }

  checkinconsent(payload: any): Observable<any> {
    const url = `${this.consentUrl}/updateconsentcheckin`;
    const body = JSON.stringify(payload);

    return this.http.put<any>(url, body, httpOptions);
  }

  createAdmissionVaccine(payload: any): Observable<any> {
    const url = `${this.admissionUrl}/vaccine-admission`;
    const body = JSON.stringify(payload);

    return this.http.post<any>(url, body, httpOptions);
  }

  getPreRegisFormById(id: string): Observable<any> {
    const uri = `${this.preregisUrl}/form/${id}`;
    return this.http.get<any>(uri, httpOptions);
  }
}

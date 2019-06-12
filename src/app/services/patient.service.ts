import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(
    private http: HttpClient
  ) { }

  private contactUrl = environment.CALL_CENTER_SERVICE + '/contacts';
  private patientUrl = environment.FRONT_OFFICE_SERVICE + '/patients';

  private patientHopeUrl = environment.CALL_CENTER_SERVICE + '/patients/hope';
  private verifyPatientUrl = environment.CALL_CENTER_SERVICE + '/patients/verify';

  private searchPatientHopeSource = new Subject<any>();
  public searchPatientHopeSource$ = this.searchPatientHopeSource.asObservable();
  private updateContactSource = new Subject<boolean>();
  public updateContactSource$ = this.updateContactSource.asObservable();

  changeSearchPatientHope(params: any) {
    this.searchPatientHopeSource.next(params);
  }
  
  emitUpdateContact(params: boolean) {
    this.updateContactSource.next(params);
  }

  updateContact(contactId: string, updateContactPayload: any): Observable<any> {
    const url = `${this.contactUrl}/${contactId}`;
    return this.http.put<any>(url, updateContactPayload, httpOptions);
  }

  getDefaultPatientType(patientId: any): Observable<any> {
    const uri = `${this.patientUrl}/${patientId}/default/patient-type`;
    return this.http.get<any>(uri, httpOptions);
  }

  createMrLocal(payload: any): Observable<any>{
    const url = `${this.patientUrl}/build/mr/local`;
    const body = JSON.stringify(payload);
    
    return this.http.post<any>(url, body, httpOptions);
  }

  searchPatientHope1(hospitalId: string, patientName: string, birthDate: string): Observable<any> {
    const url = `${this.patientHopeUrl}?hospitalId=${hospitalId}&patientName=${patientName}&birthDate=${birthDate}`;
    return this.http.get<any>(url, httpOptions);
    // return of(PATIENTHOPE);
  }

  searchPatientHope2(hospitalId: string, localMrNo: number): Observable<any> {
    const url = `${this.patientHopeUrl}?hospitalId=${hospitalId}&mrLocalNo=${localMrNo}`
    return this.http.get<any>(url, httpOptions);
    // return of(PATIENTHOPE);
  }

  addContact(addContactPayload: any): Observable<any> {
    const url = `${this.contactUrl}`;
    return this.http.post<any>(url, addContactPayload, httpOptions);
  }

  verifyPatient(verifyPatientPayload: any): Observable<any> {
    console.log(this.verifyPatientUrl);
    return this.http.post<any>(this.verifyPatientUrl, verifyPatientPayload, httpOptions);
  }
  
}

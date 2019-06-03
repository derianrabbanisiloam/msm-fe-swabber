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

  private searchPatientHopeSource = new Subject<any>();
  public searchPatientHopeSource$ = this.searchPatientHopeSource.asObservable();
  private updateContactSource = new Subject<boolean>();
  public updateContactSource$ = this.updateContactSource.asObservable();


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
  
}

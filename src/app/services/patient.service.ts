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
  private updateContactUrl = environment.FRONT_OFFICE_SERVICE + '/contacts/account/open-access-mr';
  private patientUrl = environment.FRONT_OFFICE_SERVICE + '/patients';
  private contactFoUrl = environment.FRONT_OFFICE_SERVICE + '/contacts';

  private patientHopeUrl = environment.CALL_CENTER_SERVICE + '/patients/hope';
  private verifyPatientUrl = environment.CALL_CENTER_SERVICE + '/patients/verify';

  private patientHopeDetailUrl = environment.HIS_SERVICE + '/patient';

  private uploadImageUrl = environment.UPLOAD_IMAGE + '/pdf-upload';

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

  getPatientHopeSearch(name, dob, phoneNumber, hospitalId): Observable<any> {
    const uri = `${this.contactFoUrl}/confirm?name=${name}&dob=${dob}&phoneNumber=${phoneNumber}&hospitalId=${hospitalId}`;
    return this.http.get<any>(uri, httpOptions);
  }

  getCheckMappingContact(patientHopeId, hospitalId): Observable<any> {
    const uri = `${this.patientUrl}/mapping?patientHopeId=${patientHopeId}&hospitalId=${hospitalId}`;
    return this.http.get<any>(uri, httpOptions);
  }

  uploadImage(formData: any) {
    const url = `${this.uploadImageUrl}`;
    return this.http.post<any>(url, formData);
  }

  uploadContact(payload: any) {
    const url = `${this.updateContactUrl}`;
    return this.http.put<any>(url, payload, httpOptions);
  }

  getPatientHopeDetail(patientId: number) {
    const uri = `${this.patientHopeDetailUrl}/${patientId}`;
    return this.http.get<any>(uri, httpOptions);
  }

  getAccountMobile(searchString, offset, limit){
    let uri = `${this.contactFoUrl}/account/mobile`;

    if(searchString){
      uri = `${uri}?keywords=${searchString}&limit=${limit}&offset=${offset}`;
    }else{
      uri = `${uri}?limit=${limit}&offset=${offset}`;
    }
    
    return this.http.get<any>(uri, httpOptions);
  }

  accountVerify(payload: any){
    const url = `${this.contactFoUrl}/account/verify`;
    const body = JSON.stringify(payload);
    
    return this.http.put<any>(url, body, httpOptions);
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

  searchPatientAccessMr(patientName: string, birthDate: string): Observable<any> {
    const url = `${this.patientHopeUrl}/new?patientName=${patientName}&birthDate=${birthDate}`;
    return this.http.get<any>(url, httpOptions);
  }

  searchPatientAccessMr2(hospitalId: string, localMrNo: number): Observable<any> {
    const url = `${this.patientHopeUrl}/new?hospitalId=${hospitalId}&mrLocalNo=${localMrNo}`;
    return this.http.get<any>(url, httpOptions);
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
    return this.http.post<any>(this.verifyPatientUrl, verifyPatientPayload, httpOptions);
  }

  searchPatient(name: string, birth: string, orgId?: any, ): Observable<any> {
    let url = `${this.patientUrl}/hope/name/${name}/birthdate/${birth}`;
    
    if(orgId){
      url = `${url}?organizationId=${orgId}`;
    }
    
    return this.http.get<any>(url, httpOptions);
  }

  getContact(contactId: string): Observable<any> {
    const url = `${this.contactUrl}/${contactId}`;
    return this.http.get<any>(url, httpOptions);
  }

  createPatientComplete(payload: any){
    const url = `${this.patientUrl}`;
    const body = JSON.stringify(payload);
    
    return this.http.post<any>(url, body, httpOptions);
  }

  updatePatientComplete(payload: any, patientHopeId: any){
    const url = `${this.patientUrl}/${patientHopeId}`;
    const body = JSON.stringify(payload);
    
    return this.http.put<any>(url, body, httpOptions);
  }

  syncUpdatePatient(payload: any){
    const url = `${this.patientUrl}/sync/update`;
    const body = JSON.stringify(payload);
    
    return this.http.post<any>(url, body, httpOptions);
  }
  
}

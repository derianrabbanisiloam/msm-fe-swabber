import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Appointment} from  '../models/appointments/appointment';
import { Receiver } from '../models/appointments/receiver';
import { environment } from '../../environments/environment';
import { httpOptions } from '../utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(
    private http: HttpClient
  ) { }

  private appointmentUrl = environment.FRONT_OFFICE_SERVICE + '/appointments';
  private ccAppointmentUrl = environment.CALL_CENTER_SERVICE + '/appointments';
  private rescheduleUrl = environment.CALL_CENTER_SERVICE + '/appointments/reschedules';
  private reserveSlotAppUrl = environment.CALL_CENTER_SERVICE + '/appointments/reserved-slot';
  private appointmentRescheduleCount = environment.CALL_CENTER_SERVICE + '/appointments/reschedules/count';
  private aidoWorklistUrl = environment.CALL_CENTER_SERVICE + '/appointments/aido';

  private rescheduleAppSource = new Subject<any>();
  public rescheduleAppSource$ = this.rescheduleAppSource.asObservable();
  private createAppSource = new Subject<boolean>();
  public createAppSource$ = this.createAppSource.asObservable();
  private cancelAppSource = new Subject<boolean>();
  public cancelAppSource$ = this.cancelAppSource.asObservable();
  private verifyAppSource = new Subject<boolean>();
  public verifyAppSource$ = this.verifyAppSource.asObservable();

  private updateNotesSource = new Subject<boolean>();
  public updateNotesSource$ = this.updateNotesSource.asObservable();

  emitCreateApp(params: boolean) {
    this.createAppSource.next(params);
  }

  emitCancelApp(params: boolean) {
    this.cancelAppSource.next(params);
  }

  emitVerifyApp(params: boolean) {
    this.verifyAppSource.next(params);
  }

  emitUpdateNotes(params: boolean){
    this.updateNotesSource.next(params);
  }

  updateDetailTemporaryApp(tempAppId: any, payload: any): Observable<any> {
    const url = `${this.ccAppointmentUrl}/temporary/${tempAppId}`;
    const body = JSON.stringify(payload);
    
    return this.http.put<any>(url, body, httpOptions);
  }

  getConfirmRescheduleTemp(appTemp: string) {
    const url = `${this.rescheduleUrl}/confirm?appointmentTemporaryId=${appTemp}`;
    return this.http.get<any>(url, httpOptions);
  }

  addAppointment(payload: any): Observable<any> {
    return this.http.post<any>(this.ccAppointmentUrl, payload, httpOptions);
  }

  appointmentHistory(appointment: any): Observable<any> {
    const url = `${this.ccAppointmentUrl}/history/${appointment}`;
    return this.http.get<any>(url, httpOptions);
  }
  getCountAppReschedule(hospital: string) {
    const url = `${this.appointmentRescheduleCount}?hospitalId=${hospital}`;
    return this.http.get<any>(url, httpOptions);
  }

  getListAppointment(date: any, hospital: string, name?: string, birth?: any, mr?: any, doctor?: string,
     modifiedName?: string, isWaitingList?: boolean, limit?: number, offset?: number): Observable<any> {

    let uri = `/hospital/${hospital}?date=${date}`;

    uri = name ? `${uri}&name=${name}` : uri;
    uri = birth ? `${uri}&birth=${birth}` : uri;
    uri = mr ? `${uri}&mr=${mr}` : uri;
    uri = doctor ? `${uri}&doctor=${doctor}` : uri;
    uri = modifiedName ? `${uri}&modifiedName=${modifiedName}` : uri;
    uri = isWaitingList ? `${uri}&isWaitingList=${isWaitingList}` : uri;

    const url = `${uri}&limit=${limit}&offset=${offset}`;

    return this.http.get<Appointment[]>(this.appointmentUrl + url, httpOptions);
  }

  emitRescheduleApp(params: any) {
    this.rescheduleAppSource.next(params);
  }

  getListReceiver(doctorId: string, date: any, hospitalId: any): Observable<any> {
    const uri = '/doctor/' + doctorId + '/hospital/' + hospitalId + '/date/' + date;
    return this.http.get<Receiver[]>(this.appointmentUrl + uri, httpOptions);
  }

  isLate(appointmentId: string): Observable<any>{
    const uri = '/late/' + appointmentId;
    return this.http.get<any>(this.appointmentUrl + uri, httpOptions);
  }

  getAppointmentById(appointmentId: string): Observable<any> {
    const url = `${this.ccAppointmentUrl}/${appointmentId}`;
    return this.http.get<any>(url, httpOptions);
  }

  getRescheduleWorklist(
    hospitalId: string,
    fromDate: string,
    toDate: string,
    name?: string,
    doctor?: string,
    offset?: number,
    limit?: number
  ): Observable<any> {
    let url = `${this.rescheduleUrl}?hospitalId=${hospitalId}&from=${fromDate}&to=${toDate}`;
    url = name ? `${url}&patientName=${name}` : url;
    url = doctor ? `${url}&doctorId=${doctor}` : url;
    url = `${url}&limit=${limit}&offset=${offset}`;
    
    // return of(APPOINTMENT)
    return this.http.get<any>(url, httpOptions);
  }

  getAidoWorklist(
    hospitalId: string,
    fromDate: string,
    toDate: string,
    name?: string,
    doctor?: string,
    isDoubleMr?: boolean,
    admStatus?: string,
    offset?: number,
    limit?: number
  ): Observable<any> {
    let url = `${this.aidoWorklistUrl}/hospital/${hospitalId}?fromDate=${fromDate}&toDate=${toDate}`;
    url = name ? `${url}&patientName=${name}` : url;
    url = doctor ? `${url}&doctorId=${doctor}` : url;
    url = isDoubleMr ? `${url}&isDoubleMr=${isDoubleMr}` : url;
    url = admStatus ? `${url}&admStatus=${admStatus}` : url;
    url = `${url}&limit=${limit}&offset=${offset}`;
    
    // return of(APPOINTMENT)
    return this.http.get<any>(url, httpOptions);
  }

  addRescheduleAppointment(addReschedulePayload: any): Observable<any> {
    return this.http.post<any>(this.rescheduleUrl, addReschedulePayload, httpOptions);
  }

  deleteAppointment(appointmentId: string, payload: any, temp = false) {
    let url = `${this.ccAppointmentUrl}`;

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

  getAppointmentByScheduleId(scheduleId: string, date: string, sortBy?: string, orderBy?: string): Observable<any> {
    const url = `${this.ccAppointmentUrl}?scheduleId=${scheduleId}&date=${date}&sortBy=${sortBy}&orderBy=${orderBy}`;
    // return of(APPOINTMENT);
    return this.http.get<any>(url, httpOptions);
  }

  getAppointmentByDay(date: string, sortBy?: string, orderBy?: string): Observable<any> {
    const url = `${this.ccAppointmentUrl}?&date=${date}&sortBy=${sortBy}&orderBy=${orderBy}`;
    return this.http.get<any>(url, httpOptions);
  }

  reserveSlotApp(reserveSlotAppPayload: any): Observable<any> {
    return this.http.post<any>(this.reserveSlotAppUrl, reserveSlotAppPayload, httpOptions);
  }

  getReservedSlotApp(
    scheduleId: string, 
    appointmentDate: string, 
    appointmentNo: number, 
    userId: string): Observable<any> {
    const url = `${this.reserveSlotAppUrl}?scheduleId=${scheduleId}&appointmentDate=${appointmentDate}`
      + `&appointmentNo=${appointmentNo}&userId=${userId}`;
    return this.http.get<any>(url, httpOptions);
  }

  verifyAppointment(verifyAppointmentPayload: any): Observable<any> {
    return this.http.post<any>(this.ccAppointmentUrl, verifyAppointmentPayload, httpOptions);
  }

  updateAppNotes(appointmentId: string, payload: any): Observable<any> {
    const url = `${this.appointmentUrl}/${appointmentId}/notes`;
    const body = JSON.stringify(payload);

    return this.http.put<any>(url, body, httpOptions);
  }

  getTempAppointment(tempId: any){
    const url = `${this.ccAppointmentUrl}/temporary/${tempId}`;
    // return of(APPOINTMENT);
    return this.http.get<any>(url, httpOptions);
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(operation, error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

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

  private rescheduleAppSource = new Subject<boolean>();
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
  getCountAppReschedule() {
    const url = `${this.appointmentRescheduleCount}`;
    return this.http.get<any>(url, httpOptions);
  }

  getListAppointment(date: any, hospital: string, name?: string, birth?: any, mr?: any, doctor?: string, limit?: number, offset?: number): Observable<any> {

    let uri = `/hospital/${hospital}?date=${date}`;

    if (name) {
      if (name && birth && mr && doctor) {
        uri = `${uri}&name=${name}&birth=${birth}&mr=${mr}&doctor=${doctor}`;
      } else if (name && birth && mr) {
        uri = `${uri}&name=${name}&birth=${birth}&mr=${mr}`;
      } else if (name && birth && doctor) {
        uri = `${uri}&name=${name}&birth=${birth}&doctor=${doctor}`;
      } else if (name && mr && doctor) {
        uri = `${uri}&name=${name}&mr=${mr}&doctor=${doctor}`;
      } else if (name && mr) {
        uri = `${uri}&name=${name}&mr=${mr}`;
      } else if (name && birth) {
        uri = `${uri}&name=${name}&birth=${birth}`;
      } else if (name && doctor) {
        uri = `${uri}&name=${name}&doctor=${doctor}`;
      } else {
        uri = `${uri}&name=${name}`;
      }
    } else if (mr) {
      if (mr && doctor) {
        uri = `${uri}&mr=${mr}&doctor=${doctor}`;
      } else if (mr && birth) {
        uri = `${uri}&birth=${birth}&mr=${mr}`;
      } else {
        uri = `${uri}&mr=${mr}`;
      }
    } else if (doctor) {
      if (doctor && birth) {
        uri = `${uri}&birth=${birth}&doctor=${doctor}`;
      } else {
        uri = `${uri}&doctor=${doctor}`;
      }
    } else if (birth) {
      uri = `${uri}&birth=${birth}`;
    } else {
      uri = `${uri}`;
    }

    const url = `${uri}&limit=${limit}&offset=${offset}`;

    return this.http.get<Appointment[]>(this.appointmentUrl + url, httpOptions);
  }

  emitRescheduleApp(params: boolean) {
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

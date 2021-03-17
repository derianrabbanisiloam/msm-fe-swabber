import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Appointment } from '../models/appointments/appointment';
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
  private ccAppointmentCovidUrl = environment.CALL_CENTER_SERVICE + '/appointments/covid';
  private rescheduleUrl = environment.CALL_CENTER_SERVICE + '/appointments/reschedules';
  private rescheduleVaccineUrl = environment.CALL_CENTER_SERVICE + '/appointments/reschedules/covid';
  private reserveSlotAppUrl = environment.CALL_CENTER_SERVICE + '/appointments/reserved-slot';
  private appointmentRescheduleCount = environment.CALL_CENTER_SERVICE + '/appointments/reschedules/count';
  private appointmentRescheduleAidoCount = environment.CALL_CENTER_SERVICE + '/appointments/reschedules/count/aido';
  private aidoWorklistUrl = environment.CALL_CENTER_SERVICE + '/appointments/aido';
  private preRegistrationUrl = environment.FRONT_OFFICE_SERVICE + '/preregistrations';

  private rescheduleAppSource = new Subject<any>();
  public rescheduleAppSource$ = this.rescheduleAppSource.asObservable();
  private createAppSource = new Subject<boolean>();
  public createAppSource$ = this.createAppSource.asObservable();
  private cancelAppSource = new Subject<boolean>();
  public cancelAppSource$ = this.cancelAppSource.asObservable();
  private verifyAppSource = new Subject<boolean>();
  public verifyAppSource$ = this.verifyAppSource.asObservable();
  private closeModalSource = new Subject<boolean>();
  public closeModalSource$ = this.closeModalSource.asObservable();
  private openModalSource = new Subject<any>();
  public openModalSource$ = this.openModalSource.asObservable();

  private updateNotesSource = new Subject<boolean>();
  public updateNotesSource$ = this.updateNotesSource.asObservable();

  emitCloseModal(params: boolean) {
    this.closeModalSource.next(params);
  }

  emitOpenModal(params: any) {
    this.openModalSource.next(params);
  }

  emitCreateApp(params: boolean) {
    this.createAppSource.next(params);
  }

  emitCancelApp(params: boolean) {
    this.cancelAppSource.next(params);
  }

  emitVerifyApp(params: boolean) {
    this.verifyAppSource.next(params);
  }

  emitUpdateNotes(params: boolean) {
    this.updateNotesSource.next(params);
  }

  getOrderList(date: any, hospital: string, limit: number, offset: number,
    confirmCode?: string, submitDate?: string, name?: string): Observable<any> {

    let uri = `${this.preRegistrationUrl}/orders/hospital/${hospital}?preRegDate=${date}`; 
    uri = confirmCode ? `${uri}&confirmationCode=${confirmCode}` : uri;
    uri = name ? `${uri}&name=${name}` : uri;
    const url = `${uri}&limit=${limit}&offset=${offset}`;
    return this.http.get<any>(url, httpOptions);
  }

  
  getPreRegistrationList(orderId: any, limit: number, offset: number, isNew: boolean): Observable<any> {
    let uri = `${this.preRegistrationUrl}/order/${orderId}?limit=${limit}&offset=${offset}`;

    uri = isNew ? `${uri}&isNew=${isNew}` : uri;

    return this.http.get<any>(uri, httpOptions);
  }

  updateDetailTemporaryApp(tempAppId: any, payload: any): Observable<any> {
    const url = `${this.ccAppointmentUrl}/temporary/${tempAppId}`;
    const body = JSON.stringify(payload);

    return this.http.put<any>(url, body, httpOptions);
  }

  updateAppBpjs(appointmentId: any, payload: any): Observable<any> {
    const url = `${this.ccAppointmentUrl}/${appointmentId}`;
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

  countAidoAppointment(hospital: string, fromDate: any, toDate: any): Observable<any> {
    const url = `${this.ccAppointmentUrl}/aido/count?hospitalId=${hospital}&from=${fromDate}&to=${toDate}`;
    return this.http.get<any>(url, httpOptions);
  }

  getCountAppReschedule(hospital: string, channel?: string, exclude?: boolean) {
    let url = `${this.appointmentRescheduleCount}?hospitalId=${hospital}`;
    url = channel ? `${url}&channelId=${channel}` : url;
    url = `${url}&exclude=${exclude}`;
    return this.http.get<any>(url, httpOptions);
  }

  getCountAppRescheduleAido(hospital: string) {
    let url = `${this.appointmentRescheduleAidoCount}?hospitalId=${hospital}`;
    return this.http.get<any>(url, httpOptions);
  }

  getListAppointment(date: any, hospital: string, name?: string, birth?: any, mr?: any, doctor?: string,
    modifiedName?: string, isWaitingList?: boolean, limit?: number, offset?: number, channel?: string,
    exclude?: boolean): Observable<any> {

    let uri = `/hospital/${hospital}?date=${date}`;

    uri = name ? `${uri}&name=${name}` : uri;
    uri = birth ? `${uri}&birth=${birth}` : uri;
    uri = mr ? `${uri}&mr=${mr}` : uri;
    uri = doctor ? `${uri}&doctor=${doctor}` : uri;
    uri = modifiedName ? `${uri}&modifiedName=${modifiedName}` : uri;
    uri = isWaitingList ? `${uri}&isWaitingList=${isWaitingList}` : uri;
    uri = channel ? `${uri}&channelId=${channel}` : uri;
    uri = `${uri}&exclude=${exclude}`;

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

  isLate(appointmentId: string): Observable<any> {
    const uri = '/late/' + appointmentId;
    return this.http.get<any>(this.appointmentUrl + uri, httpOptions);
  }

  getAppointmentById(appointmentId: string): Observable<any> {
    const url = `${this.ccAppointmentUrl}/${appointmentId}`;
    return this.http.get<any>(url, httpOptions);
  }

  getAppointmentCovidById(appointmentId: string): Observable<any> {
    const url = `${this.ccAppointmentCovidUrl}/detail/${appointmentId}`;
    return this.http.get<any>(url, httpOptions);
  }

  getRescheduleWorklist(
    hospitalId: string,
    fromDate: string,
    toDate: string,
    name?: string,
    doctor?: string,
    offset?: number,
    limit?: number,
    channel?: string,
    exclude?: boolean
  ): Observable<any> {
    let url = `${this.rescheduleUrl}?hospitalId=${hospitalId}&from=${fromDate}&to=${toDate}`;
    url = name ? `${url}&patientName=${name}` : url;
    url = doctor ? `${url}&doctorId=${doctor}` : url;
    url = `${url}&limit=${limit}&offset=${offset}`;
    url = channel ? `${url}&channelId=${channel}` : url;
    url = `${url}&exclude=${exclude}`;
    // return of(APPOINTMENT)
    return this.http.get<any>(url, httpOptions);
  }

  getRescheduleWorklistAido(
    hospitalId: string,
    fromDate: string,
    toDate: string,
    name?: string,
    doctor?: string,
    offset?: number,
    limit?: number
  ): Observable<any> {
    let url = `${this.rescheduleUrl}/aido?hospitalId=${hospitalId}&from=${fromDate}&to=${toDate}`;
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
    payStatus?: string,
    offset?: number,
    limit?: number
  ): Observable<any> {
    let url = `${this.aidoWorklistUrl}/hospital/${hospitalId}?fromDate=${fromDate}&toDate=${toDate}`;
    url = name ? `${url}&patientName=${name}` : url;
    url = doctor ? `${url}&doctorId=${doctor}` : url;
    url = isDoubleMr ? `${url}&isDoubleMr=${isDoubleMr}` : url;
    url = admStatus ? `${url}&admStatus=${admStatus}` : url;
    url = payStatus ? `${url}&paymentStatus=${payStatus}` : url;
    url = `${url}&limit=${limit}&offset=${offset}`;

    // return of(APPOINTMENT)
    return this.http.get<any>(url, httpOptions);
  }

  submitEligibleAido(payload: any, appId: string): Observable<any> {
    const url = `${this.aidoWorklistUrl}/${appId}`;
    return this.http.put<any>(url, payload, httpOptions);
  }

  addRescheduleAppointment(addReschedulePayload: any): Observable<any> {
    return this.http.post<any>(this.rescheduleUrl, addReschedulePayload, httpOptions);
  }

  addRescheduleAppointmentVaccine(addReschedulePayload: any): Observable<any> {
    return this.http.post<any>(this.rescheduleVaccineUrl, addReschedulePayload, httpOptions);
  }

  deleteAppointment(appointmentId: string, payload: any, temp = false, isAido = false) {
    let url = `${this.ccAppointmentUrl}`;

    if (isAido) {
      url = `${url}/aido/${appointmentId}`;
    }

    if (temp) {
      url = `${url}/temporary/${appointmentId}`;
    }

    if (!temp && !isAido) {
      url = `${url}/${appointmentId}`
    }

    const body = JSON.stringify(payload);

    const options = {
      ...httpOptions,
      body,
    };

    return this.http.delete<any>(url, options);
  }

  deleteAppointmentVaccine(registrationFormId: string, payload: any) {
    let url = `${this.preRegistrationUrl}/worklist/${registrationFormId}`;
    const body = JSON.stringify(payload);
    return this.http.put<any>(url, body, httpOptions);
  }

  getAppointmentByScheduleId(scheduleId: string, date: string, sortBy?: string, orderBy?: string): Observable<any> {
    const url = `${this.ccAppointmentUrl}?scheduleId=${scheduleId}&date=${date}&sortBy=${sortBy}&orderBy=${orderBy}`;
    // return of(APPOINTMENT);
    return this.http.get<any>(url, httpOptions);
  }

  getAppointmentByDay(hospitalId: string, doctorId: string, date: string, sortBy?: string, orderBy?: string): Observable<any> {
    let url = `${this.ccAppointmentUrl}?hospitalId=${hospitalId}&doctorId=${doctorId}&date=${date}&sortBy=${sortBy}&orderBy=${orderBy}`;
    return this.http.get<any>(url, httpOptions);
  }

  getAppointmentByDayCovid(hospitalId: string, checkupId: string, date: string, isDriveThru?: boolean): Observable<any> {
    let url = `${this.ccAppointmentCovidUrl}/list?hospitalId=${hospitalId}&checkUpId=${checkupId}&date=${date}`;
    url = isDriveThru !== null && isDriveThru !== undefined ? `${url}&isDriveThru=${isDriveThru}` : url;
    return this.http.get<any>(url, httpOptions);
  }

  reserveSlotApp(reserveSlotAppPayload: any): Observable<any> {
    return this.http.post<any>(this.reserveSlotAppUrl, reserveSlotAppPayload, httpOptions);
  }

  getReservedSlotApp(
    scheduleId: string,
    appointmentDate: string,
    appointmentNo: number,
    userId: string,
    channelId: string): Observable<any> {
    const url = `${this.reserveSlotAppUrl}?scheduleId=${scheduleId}&appointmentDate=${appointmentDate}`
      + `&appointmentNo=${appointmentNo}&userId=${userId}&channelId=${channelId}`;
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


  getTempAppointment(tempId: any) {
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

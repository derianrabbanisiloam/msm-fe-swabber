import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(
    private http: HttpClient
  ) { }
  
  private opAdminScheduleUrl = environment.OPADMIN_SERVICE + '/schedules';
  private scheduleBlockUrl = environment.CALL_CENTER_SERVICE + '/schedules/block';
  private leaveUrl = environment.OPADMIN_SERVICE + '/doctors/leaves';

  private scheduleBlockSource = new Subject<boolean>();
  public scheduleBlockSource$ = this.scheduleBlockSource.asObservable();

  emitScheduleBlock(params: boolean) {
    this.scheduleBlockSource.next(params);
  }

  scheduleDetail(scheduleId: string): Observable<any> {
    const uri = `${this.opAdminScheduleUrl}/${scheduleId}`;
    return this.http.get<any>(uri, httpOptions);
  }

  getScheduleBlock(scheduleId: string, date: string): Observable<any> {
    const url = `${this.scheduleBlockUrl}/${scheduleId}?date=${date}`;
    return this.http.get<any>(url, httpOptions);
  }

  addScheduleBlock(scheduleBlockId: string, addSchBlockPayload: any): Observable<any> {
    const url = `${this.scheduleBlockUrl}/${scheduleBlockId}`
    return this.http.post<any>(url, addSchBlockPayload, httpOptions);
  }

  updateScheduleBlock(scheduleBlockId: string, updateSchBlockPayload: any): Observable<any> {
    const url = `${this.scheduleBlockUrl}/${scheduleBlockId}`
    return this.http.put<any>(url, updateSchBlockPayload, httpOptions);
  }

  deleteScheduleBlock(scheduleBlockId: string, deleteSchBlockPayload: any) {
    const url = `${this.scheduleBlockUrl}/${scheduleBlockId}`;
    const body = JSON.stringify(deleteSchBlockPayload);
    const options = {
      ...httpOptions,
      body,
    };
    return this.http.delete<any>(url, options);
  }

  getLeaveHeader(
    year: string, 
    hospitalId: string, 
    doctorId?: string,
    areaId?: string,
    specialityId?: string
  ): Observable<any> {
    let url = `${this.leaveUrl}?&year=${year}`;
    if (doctorId) {
      url = `${url}&doctorId=${doctorId}`;
    } else if (areaId && specialityId) {
      url = `${url}&areaId=${areaId}&specialityId=${specialityId}`;
    } else if (hospitalId && specialityId) {
      url = `${url}&hospitalId=${hospitalId}&specialityId=${specialityId}`;
    }
    return this.http.get<any>(url, httpOptions);
  }

}

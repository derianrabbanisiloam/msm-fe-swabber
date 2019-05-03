import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { General } from '../../app/models/generals/general';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private http: HttpClient
  ) { }

  private generalUrl = environment.FRONT_OFFICE_SERVICE + '/generals/notification';

  getBloodType(): Observable<any> {
    const uri = 'bloodtype';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getGender(): Observable<any> {
    const uri = 'genders';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getMaritalStatus(): Observable<any> {
    const uri = 'marital';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getNotificationType(): Observable<any> {
    const uri = 'notification';
    return this.http.get<General[]>(this.generalUrl);
  }

  getNationalityIdType(): Observable<any> {
    const uri = 'nationalidtype';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getPatientType(): Observable<any> {
    const uri = 'patienttype';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getReligion(): Observable<any> {
    const uri = 'religions';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getTitle(): Observable<any> {
    const uri = 'titles';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
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

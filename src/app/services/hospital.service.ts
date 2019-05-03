import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HospitalSSO } from '../../app/models/hospitals/sso.hospital';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private http: HttpClient
  ) { }

  private ssoUrl = environment.SSO_SERVICE;

  getSSOHospital(): Observable<any> {
    const uri = '/organizationselect';
    return this.http.get<HospitalSSO[]>(this.ssoUrl + uri, httpOptions);
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

import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient
  ) { }

  private notificationUrl = environment.FRONT_OFFICE_SERVICE + '/notifications';

  sendNotification(payload: any): Observable<any> {
    const body = JSON.stringify(payload);
    return this.http.post<any>(this.notificationUrl, body, httpOptions);
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

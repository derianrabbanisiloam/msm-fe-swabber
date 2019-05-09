import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  private userUrl = environment.FRONT_OFFICE_SERVICE + '/users/';

  signUp(payload: any): Observable<any> {
    const uri = 'signup';
    const body = JSON.stringify(payload);

    return this.http.post<any>(this.userUrl + uri, body, httpOptions);
  }

  signIn(payload: any): Observable<any> {
    const uri = 'signin';
    const body = JSON.stringify(payload);

    return this.http.post<any>(this.userUrl + uri, body, httpOptions);
  }

  signOut() {
    localStorage.clear();
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

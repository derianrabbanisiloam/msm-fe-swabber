import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Appointment} from '../../app/models/appointments/appointment';
import { Receiver } from '../../app/models/appointments/receiver';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(
    private http: HttpClient
  ) { }

  private appointmentUrl = environment.FRONT_OFFICE_SERVICE + '/appointments';

  getListReceiver(doctorId: string, date: any, hospitalId: any): Observable<any> {
    const uri = '/doctor/' + doctorId + '/hospital/' + hospitalId + '/date/' + date;
    return this.http.get<Receiver[]>(this.appointmentUrl + uri, httpOptions);
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

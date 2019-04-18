import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Car } from '../../app/models/car';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(
    private http: HttpClient
  ) { }

  private carUrl = environment.DUMMY_SERVICE + '/files/belajar/api.php';

  getCars(): Observable<any> {
    return this.http.get<Car[]>(this.carUrl);
  }

  addCar (car: Car): Observable<Car> {
    return this.http.post<Car>(this.carUrl, car, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addCar', car))
      // );
  }

  deleteCar (car: Car | number): Observable<Car> {
    console.log(car)
    const id = typeof car === 'number' ? car : car.id;
    const url = `${this.carUrl}/${id}`;
 
    return this.http.delete<Car>(url, httpOptions).pipe(
      catchError(this.handleError<Car>('deleteCar'))
    );
  }
 
  /** PUT: update the hero on the server */
  updateCar (car: Car): Observable<any> {
    const id = car.id;
    const url = `${this.carUrl}/${id}`;

    return this.http.put(url, car, httpOptions).pipe(
      catchError(this.handleError<any>('updateCar'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(operation, error); // log to console instead
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}

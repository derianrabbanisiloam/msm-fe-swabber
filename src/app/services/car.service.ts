import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Car } from '../../app/models/car';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(
    private http: HttpClient
  ) { }

  private carUrl = environment.DUMMY_SERVICE + '/files/belajar/api.php';

  private httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':  'application/json',
      'Authorization': 'Basic ' + btoa('ganexa:Ba5kXUsLqC64zpdMg4zNrB8n'),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, HEAD',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Secret',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '1728000'
    })
  };

  getCars(): Observable<any> {
    return this.http.get<Car[]>(this.carUrl);
  }

  addCar (car: Car): Observable<Car> {
    return this.http.post<Car>(this.carUrl, car, this.httpOptions);
      // .pipe(
      //   catchError(this.handleError('addCar', car))
      // );
  }

  deleteCar (car: Car | number): Observable<Car> {
    console.log(car)
    const id = typeof car === 'number' ? car : car.id;
    const url = `${this.carUrl}/${id}`;
 
    return this.http.delete<Car>(url, this.httpOptions).pipe(
      catchError(this.handleError<Car>('deleteCar'))
    );
  }
 
  /** PUT: update the hero on the server */
  updateCar (car: Car): Observable<any> {
    const id = car.id;
    const url = `${this.carUrl}/${id}`;

    return this.http.put(url, car, this.httpOptions).pipe(
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

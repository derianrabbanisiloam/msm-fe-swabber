import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { DoctorHospital } from '../../app/models/doctors/doctor-hospital';
import { Doctor } from '../../app/models/doctors/doctor';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(
    private http: HttpClient
  ) { }

  private doctorUrl = environment.OPADMIN_SERVICE + '/doctors';

  getDoctorQuota(hospitalId: any): Observable<any> {
    const uri = '/hospital/' + hospitalId;
    return this.http.get<DoctorHospital[]>(this.doctorUrl + uri, httpOptions);
  }

  getListDoctor(hospitalId: any): Observable<any> {
    const uri = '/lite?hospitalId=' + hospitalId;
    return this.http.get<Doctor[]>(this.doctorUrl + uri, httpOptions);
  }

  // paging doctor quota
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    const totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number;
    let endPage: number;

    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    // let pages = _.range(startPage, endPage + 1)

    const pages = Array.from( Array (endPage + 1 - startPage), (_ , i) => startPage + i );

    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages
    };
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

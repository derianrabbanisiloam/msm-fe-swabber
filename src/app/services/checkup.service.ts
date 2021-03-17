import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { httpOptions } from '../utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class CheckupService {

  constructor(
    private http: HttpClient
  ) { }

  private getCategoryUrl = environment.OPADMIN_SERVICE + '/checkups/categories/hospital';
  private checkupUrl = environment.OPADMIN_SERVICE + '/checkups/schedule/note';

  getCategory(hospitalId: string): Observable<any> {
    let url = this.getCategoryUrl;
    url = `${url}/${hospitalId}`;
    return this.http.get<any[]>(url, httpOptions)
  }

  editCheckupNote(payload: any, noteId: string) {
    let body = JSON.stringify(payload)
    let url = this.checkupUrl + `/${noteId}`
    return this.http.put<any[]>(url, body, httpOptions)
  }

}

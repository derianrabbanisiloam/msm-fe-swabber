import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Consent } from '../models/consents/consent';
import { environment } from '../../environments/environment';
import { httpOptions } from '../utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {

  constructor(
    private http: HttpClient
  ) { }

  private consentUrl = environment.VACCINE_CONSENT_SERVICE

  getByCode(code: string, orgId: number): Observable<any> {
    const uri = `${this.consentUrl}/consent/1/${orgId}/${code}/1990-01-01`
    return this.http.get<Consent[]>(uri, httpOptions)
  }


}

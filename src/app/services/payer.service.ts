import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions } from '../utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class PayerService {

  constructor(
    private http: HttpClient
  ) { }
  
  private payerUrl = 'http://localhost:1738/api/v2/'
  
  
  checkEligible(payload: any){
    const url = `${this.payerUrl}payer-portal`
    return this.http.post<any>(url, payload, httpOptions)
  }

  getListRefferal(payload: any){
    const url = `${this.payerUrl}payer-portal/list-referral`
    return this.http.post<any>(url, payload, httpOptions)
  }

  getDeaseClasification(payload: any){
    const url = `${this.payerUrl}generals/disease-classification`
    return this.http.post<any>(url, payload, httpOptions)
  }
}



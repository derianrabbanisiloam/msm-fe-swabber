import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions } from '../utils/http.util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayerService {

  constructor(
    private http: HttpClient
  ) { }
  
  private payerUrl = environment.FRONT_OFFICE_SERVICE

  checkEligible(payload: any){
    const url = `${this.payerUrl}/payer-portal`
    return this.http.post<any>(url, payload, httpOptions)
  }

  getListRefferal(payload: any){
    const url = `${this.payerUrl}/payer-portal/list-referral`
    return this.http.post<any>(url, payload, httpOptions)
  }

  getDeaseClasification(payload: any){
    const url = `${this.payerUrl}/generals/disease-classification`
    return this.http.post<any>(url, payload, httpOptions)
  }

  getPrint(payload: any){
    const url = `${this.payerUrl}/payer-portal/reprint`
    return this.http.post<any>(url, payload, httpOptions)
  }
}



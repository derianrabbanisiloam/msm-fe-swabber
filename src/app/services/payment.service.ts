import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { httpOptions } from '../utils/http.util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private http: HttpClient
  ) { }

  private paymentUrl = environment.PAYMENT + '/insertpaymentrequest';
  private paymentCallBackUrl = environment.FRONT_OFFICE_SERVICE + '/preregistrations/payment-code';
  private salesItemListUrl = environment.FRONT_OFFICE_SERVICE + '/generals/sales-item';

  payment(payload: any): Observable<any> {
    return this.http.post<any>(this.paymentUrl, payload, httpOptions);
  }

  paymentForMySiloam(payload: any, orderId: string): Observable<any> {
    const uri = '/' + orderId;
    return this.http.put<any>(this.paymentCallBackUrl + uri, payload, httpOptions);
  }

  getListSalesItem(hospitalHopeId: any): Observable<any> {
    const uri = '/hospital/' + hospitalHopeId;
    return this.http.get<any>(this.salesItemListUrl + uri, httpOptions);
  }
}

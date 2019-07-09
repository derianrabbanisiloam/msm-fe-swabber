import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Country } from '../models/generals/country';
import { General } from '../models/generals/general';
import { City } from '../models/generals/city';
import { District } from '../models/generals/district';
import { Subdistrict } from '../models/generals/subdistrict';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private http: HttpClient
  ) { }

  private generalUrl = environment.FRONT_OFFICE_SERVICE + '/generals/';
  private generalOpAdminUrl = environment.OPADMIN_SERVICE + '/generals/';

  getHospital(): Observable<any> {
    const uri = `${this.generalOpAdminUrl}hospitals`;
    return this.http.get<any>(uri, httpOptions);
  }

  getAdmissionType(): Observable<any> {
    const uri = 'admission-type';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getBloodType(): Observable<any> {
    const uri = 'bloodtype';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getGender(): Observable<any> {
    const uri = 'genders';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getMaritalStatus(): Observable<any> {
    const uri = 'marital';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getNotificationType(): Observable<any> {
    const uri = 'notification';
    return this.http.get<General[]>(this.generalUrl + uri);
  }

  getNationalityIdType(): Observable<any> {
    const uri = 'nationalidtype';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getPayer(hospitalId: string): Observable<any> {
    const uri = 'payers/hospital/'+hospitalId;
    return this.http.get<any[]>(this.generalUrl + uri, httpOptions);
  }

  getPatientType(): Observable<any> {
    const uri = 'patienttype';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getReligion(): Observable<any> {
    const uri = 'religions';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getTitle(): Observable<any> {
    const uri = 'titles';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getReferralType(): Observable<any> {
    const uri = 'referral-type';
    return this.http.get<General[]>(this.generalUrl + uri, httpOptions);
  }

  getCountry(): Observable<any> {
    const uri = 'countries';
    return this.http.get<Country[]>(this.generalUrl + uri, httpOptions);
  }

  getCity(): Observable<any> {
    const uri = 'cities';
    return this.http.get<City[]>(this.generalUrl + uri, httpOptions);
  }

  getDistrict(cityId? : any, districtId? : any): Observable<any> {
    if(cityId){
      const uri = `district/city/${cityId}`;
      return this.http.get<District[]>(this.generalUrl + uri, httpOptions);
    }

    if(districtId){
      const uri = `district/${districtId}`;
      return this.http.get<District>(this.generalUrl + uri, httpOptions);
    }
  }

  getSubDistrict(districtId? : any, subDistrictId? : any): Observable<any> {
    if(districtId){
      const uri = `subdistrict/district/${districtId}`;
      return this.http.get<Subdistrict[]>(this.generalUrl + uri, httpOptions);
    }

    if(subDistrictId){
      const uri = `subdistrict/${subDistrictId}`;
      return this.http.get<Subdistrict>(this.generalUrl + uri, httpOptions);
    }
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

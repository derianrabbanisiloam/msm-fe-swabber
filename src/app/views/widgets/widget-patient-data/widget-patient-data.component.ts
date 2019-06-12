import { Component, OnInit } from '@angular/core';
import { General } from '../../../models/generals/general';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-widget-patient-data',
  templateUrl: './widget-patient-data.component.html',
  styleUrls: ['./widget-patient-data.component.css']
})
export class WidgetPatientDataComponent implements OnInit {
  
  public listSex: General[];
  public listTitle: General[];
  public listReligion: General[];
  public listMarital: General[];
  public listBloodType: General[];

  constructor(
    private generalService: GeneralService,
  ) { }

  ngOnInit() {
    this.getSex();
    this.getMarital();
    this.getTitle();
    this.getReligion();
    this.getBloodType();
  }

  async getSex(){
    this.listSex = await this.generalService.getGender()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

  async getMarital(){
    this.listMarital = await this.generalService.getMaritalStatus()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

  async getTitle(){
    this.listTitle = await this.generalService.getTitle()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

  async getReligion(){
    this.listReligion = await this.generalService.getReligion()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

  async getBloodType(){
    this.listBloodType = await this.generalService.getBloodType()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

}

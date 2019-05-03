import { Component, OnInit } from '@angular/core';
import { AuthGuard} from '../../../guard/auth.guard';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.css']
})
export class SectionHeaderComponent implements OnInit {

  title = 'msm-fe-template';

  public currentHospital: any = {};
  public currentUser: any = {};
  public hospitals: any;

  constructor(public auth: AuthGuard) { }

  ngOnInit() {
    this.getInformation();
  }

  async getInformation(){
    let name = localStorage.getItem('fullname');
    let hospitals = localStorage.getItem('hospitals'); 
    this.currentHospital.name = localStorage.getItem('hospitalName');
    this.currentHospital.alias = localStorage.getItem('hospitalAlias');
    this.currentUser.fullname = name.length > 20 ? name.substr(0,20)+'...' : name;
    this.hospitals = JSON.parse(hospitals); 
  }

  changeOrg(hospitalId) {
    const selectedOrg = hospitalId; 
    const idx = this.hospitals.findIndex((i)=>{
      return i.hospitalId === selectedOrg
    });

    localStorage.setItem('hospitalId', this.hospitals[idx].hospitalId);
    localStorage.setItem('organizationId', this.hospitals[idx].organizationId);
    localStorage.setItem('hospitalName', this.hospitals[idx].hospitalName);
    localStorage.setItem('hospitalAlias', this.hospitals[idx].hospitalAlias);
    localStorage.setItem('timeZone', this.hospitals[idx].timeZone);
 }

}

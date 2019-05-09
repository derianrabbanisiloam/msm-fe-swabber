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
  public key: any = JSON.parse(localStorage.getItem('key'));

  constructor(public auth: AuthGuard) { }

  ngOnInit() {
    this.getInformation();
  }

  async getInformation(){

    const user = this.key.user;
    const hospital = this.key.hospital;
    const collection = this.key.collection; 

    let name = user.fullname;
    this.currentHospital.name = hospital.name;
    this.currentHospital.alias = hospital.alias;
    this.currentUser.fullname = name.length > 20 ? name.substr(0,20)+'...' : name;
    this.hospitals = collection;
  }

  getAllQueue(){
    
  }

  changeOrg(hospitalId) {
    const selectedOrg = hospitalId; 
    const idx = this.hospitals.findIndex((i)=>{
      return i.id === selectedOrg
    });
    
    this.key.hospital = {
      id: this.hospitals[idx].id,
      orgId: this.hospitals[idx].orgId,
      name: this.hospitals[idx].name,
      alias: this.hospitals[idx].alias,
      zone: this.hospitals[idx].zone,     
    };
    
    localStorage.setItem('key', JSON.stringify(this.key));
 }

}

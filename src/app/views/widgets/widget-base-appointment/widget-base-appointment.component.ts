import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctors/doctor';
import { AlertService } from '../../../services/alert.service';
import { Speciality } from '../../../models/specialities/speciality';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { isEmpty } from 'lodash';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-widget-base-appointment',
  templateUrl: './widget-base-appointment.component.html',
  styleUrls: ['./widget-base-appointment.component.css']
})
export class WidgetBaseAppointmentComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public doctorList: Doctor[];
  public alerts: Alert[] = [];
  public model: any = { speciality: '', doctor: '' };
  public specialities: Speciality[];
  public fromPreRegis: any;
  public searchKeywords: any = {
    doctor: {},
    area: {},
    hospital: {},
    speciality: {}
  };

  public showSchedule: boolean = false;
  public searchAutoComplete: any;

  constructor(
    private doctorService: DoctorService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit() {
    
    
    if (this.doctorService.searchDoctorSource2){
      if (this.doctorService.searchDoctorSource2.fromPreRegis === true){
        this.fromPreRegis = true
        localStorage.setItem('fromPreRegis', JSON.stringify(this.doctorService.searchDoctorSource2))
      }
    }
    await this.getListDoctor();
    await this.getSpecialities();
    await this.fromBack();
  }

  fromBack() {
    const type = this.route.snapshot.queryParams['type'];
    const preReg = this.route.queryParams['fromPreRegis']
    const specialtyId = this.route.snapshot.queryParams['speciality_id']

    if (preReg === 'true') {
      this.fromPreRegis = true;
    } else {
      this.fromPreRegis = false;
    }

    if (type) {
      if (type === 'doctor') {
        const searchKey = {
          doctor_id: this.route.snapshot.queryParams['doctor_id'],
          name: this.route.snapshot.queryParams['name'],
        };

        const idx = this.doctorList.findIndex((a) => {
          return a.doctor_id === searchKey.doctor_id;
        });

        this.searchAutoComplete = this.doctorList[idx];
        this.searchSchedule1(searchKey);
      } else if(specialtyId) {
        const searchKey = {
          speciality_id: this.route.snapshot.queryParams['speciality_id'],
          speciality_name: this.route.snapshot.queryParams['speciality_name'],
        };

        const idx = this.specialities.findIndex((a) => {
          return a.speciality_id === searchKey.speciality_id;
        });
        this.model.speciality = this.specialities[idx];
        this.searchSchedule2();
      }
    }

    
  }

  async getListDoctor() {

    this.alerts = [];

    this.doctorList = await this.doctorService.getListDoctor(this.hospital.id)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        this.alertService.error(err.error.message);
        return [];
      });
  }

  async getSpecialities(specialityname = null, total = null) {
    this.specialities = await this.doctorService.getSpecialities(specialityname, total)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        this.alertService.error(err.error.message);
        return [];
      });

    if (this.specialities.length !== 0) {
      this.specialities.map(x => {
        x.speciality_name = isEmpty(x.speciality_name) ? '' : x.speciality_name;
      });
    }
  }

  searchSchedule1(item) {
    this.model.speciality = '';
    this.searchKeywords.doctor = {
      doctor_id: item.doctor_id,
      name: item.name
    };

    const searchKey = {
      type: 'doctor',
      doctor_id: item.doctor_id,
      name: item.name,
    };

    localStorage.setItem('searchKey', JSON.stringify(searchKey));

    this.doctorService.changeSearchDoctor(this.searchKeywords);
    this.doctorService.searchDoctorSource2 = this.searchKeywords;

    this.showSchedule = true;
  }

  searchSchedule2() {
    this.model.doctor = '';
    const speciality = this.model.speciality;

    this.searchKeywords = {
      doctor: {
        doctor_id: null,
        name: null,
      },
      area: {
        area_id: null,
        name: null,
      },
      hospital: {
        hospital_id: this.hospital.id,
        name: this.hospital.name,
      },
      speciality: {
        speciality_id: speciality.speciality_id,
        speciality_name: speciality.speciality_name,
      },
    };

    const searchKey = {
      type: 'spesialist',
      speciality_id: speciality.speciality_id,
      speciality_name: speciality.speciality_name,
    };

    localStorage.setItem('searchKey', JSON.stringify(searchKey));

    this.doctorService.changeSearchDoctor(this.searchKeywords);
    this.doctorService.searchDoctorSource2 = this.searchKeywords;

    this.showSchedule = true;
  }

}

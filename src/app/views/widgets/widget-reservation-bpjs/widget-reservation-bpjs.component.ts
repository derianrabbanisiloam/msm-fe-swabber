import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctors/doctor';
import { AlertService } from '../../../services/alert.service';
import { Speciality } from '../../../models/specialities/speciality';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { isEmpty } from 'lodash';
import { environment } from '../../../../environments/environment';
import { consultationType } from '../../../variables/common.variable';

@Component({
  selector: 'app-widget-reservation-bpjs',
  templateUrl: './widget-reservation-bpjs.component.html',
  styleUrls: ['./widget-reservation-bpjs.component.css']
})
export class WidgetReservationBpjsComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public doctorList: Doctor[];
  public alerts: Alert[] = [];
  public model: any = { speciality: '', doctor: '' };
  public specialities: Speciality[];
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
    await this.getListDoctor();
    await this.getSpecialities();
    await this.fromBack();
  }

  fromBack() {
    const type = this.route.snapshot.queryParams['type'];

    if (type) {
      if (type === 'doctor') {
        let doctorId = this.route.snapshot.queryParams['doctor_id'];
        const idx = this.doctorList.findIndex((a) => {
          return a.doctor_id === doctorId;
        });

        this.searchAutoComplete = this.doctorList[idx];
        const searchKey = {
          doctor_id: doctorId,
          name: this.route.snapshot.queryParams['name'],
          specialty_id: this.searchAutoComplete.specialty_id
        };
        
        this.searchSchedule1(searchKey);
      } else {
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

    this.searchKeywords = {
      doctor: {
        doctor_id: item.doctor_id,
        name: item.name
      },
      hospital: {
        hospital_id: this.hospital.id,
        name: this.hospital.name,
      },
      speciality: {
        speciality_id: item.specialty_id,
      },
      fromBpjs: true,
      fromRegistration: true,
      consulType: consultationType.BPJS
    };

    this.searchKeywords.doctor = {
      doctor_id: item.doctor_id,
      name: item.name
    };

    const searchKey = {
      type: 'doctor',
      doctor_id: item.doctor_id,
      name: item.name
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
      fromBpjs: true,
      fromRegistration: true,
      consulType: consultationType.BPJS
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

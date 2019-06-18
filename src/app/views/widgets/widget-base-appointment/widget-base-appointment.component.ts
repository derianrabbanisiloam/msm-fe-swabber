import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMyDpOptions } from 'mydatepicker';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AdmissionService } from '../../../services/admission.service';
import { Doctor } from '../../../models/doctors/doctor';
import { General } from '../../../models/generals/general';
import { Appointment } from '../../../models/appointments/appointment';
import { dateFormatter } from '../../../utils/helpers.util';
import { AlertService } from '../../../services/alert.service';
import { GeneralService } from '../../../services/general.service';
import { QueueService } from '../../../services/queue.service';
import { ScheduleService } from '../../../services/schedule.service';
import { PatientService } from '../../../services/patient.service';
import { Speciality } from '../../../models/specialities/speciality';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { sourceApps, queueType } from '../../../variables/common.variable';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-widget-base-appointment',
  templateUrl: './widget-base-appointment.component.html',
  styleUrls: ['./widget-base-appointment.component.css']
})
export class WidgetBaseAppointmentComponent implements OnInit {

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

  constructor(
    private doctorService: DoctorService,
    private alertService: AlertService,
    private router: Router, 
  ) { }

  ngOnInit() {
    this.getListDoctor();
    this.getSpecialities();
  }

  async getListDoctor() {

    this.alerts = [];

    this.doctorList = await this.doctorService.getListDoctor(this.hospital.id)
    .toPromise().then( res => {
      if (res.status === 'OK' && res.data.length === 0) {
        this.alertService.success('No List Doctor in This Hospital');
      }

      return res.data;
    }).catch( err => {
      this.alertService.error(err.error.message);
      return [];
    });
  }

  async getSpecialities(specialityname = null, total = null) {
    this.doctorService.getSpecialities(specialityname, total)
      .subscribe(data => {
        this.specialities = data.data;
        this.specialities.map(x => {
          x.speciality_name = isEmpty(x.speciality_name) ? '' : x.speciality_name;
        });
      }, err => {
        this.specialities = [];
      });
  }

  searchSchedule1(item){
    this.model.speciality = '';
    
    this.searchKeywords.doctor = {
      doctor_id: item.doctor_id,
      name: item.name
    }

    console.log("++++++", this.searchKeywords);
    this.doctorService.changeSearchDoctor(this.searchKeywords);
    this.doctorService.searchDoctorSource2 = this.searchKeywords;

    this.showSchedule = true;
  }

  searchSchedule2(){
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

    this.doctorService.changeSearchDoctor(this.searchKeywords);
    this.doctorService.searchDoctorSource2 = this.searchKeywords;

    this.showSchedule = true;
  }

}

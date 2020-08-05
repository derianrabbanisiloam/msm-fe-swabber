import * as moment from 'moment';
import { Component, OnInit, Input } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../services/appointment.service';
import { editContactPayload } from '../../../payloads/edit-contact.payload';
import { sourceApps, channelId } from '../../../variables/common.variable';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Doctor } from '../../../models/doctors/doctor';
import { AlertService } from '../../../services/alert.service';
import { Speciality } from '../../../models/specialities/speciality';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { dateFormatter } from '../../../utils/helpers.util';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-modal-appointment-bpjs',
  templateUrl: './modal-appointment-bpjs.component.html',
  styleUrls: ['./modal-appointment-bpjs.component.css']
})
export class ModalAppointmentBpjsComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  @Input() appointmentSelected: any;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;

  public opScheduleSelected: any;
  public opSlotSelected: any;
  public createAppInputData: any = {};
  public rescheduleSelected: any = {};
  public isOpenDoctorSchedule: boolean = false;
  public appointment: any = {};
  public editContactPayload: editContactPayload;
  public createAppBpjsPayload;
  public editModel: any = {};
  public flag: string;
  public dateConvert: any;

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
    private appointmentService: AppointmentService,
    private activeModal: NgbActiveModal,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit() {
    await this.getAppointmentById();
    await this.getListDoctor();
    await this.getSpecialities();
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
      original: false,
    };

    const searchKey = {
      type: 'doctor',
      doctor_id: item.doctor_id,
      name: item.name
    };

    localStorage.setItem('searchKey', JSON.stringify(searchKey));

    this.doctorService.changeSearchDoctor(this.searchKeywords);
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
      original: false,
    };

    const searchKey = {
      type: 'spesialist',
      speciality_id: speciality.speciality_id,
      speciality_name: speciality.speciality_name,
    };

    localStorage.setItem('searchKey', JSON.stringify(searchKey));

    this.doctorService.changeSearchDoctor(this.searchKeywords);
  }

  async getAppointmentById() {
    console.log('!!!!!!!@@@@@@@#######', this.appointmentSelected)
    this.dateConvert = dateFormatter(this.appointmentSelected.birthDate, true);
    this.appointment = this.appointmentSelected;
    this.rescheduleSelected.note = this.appointment.appointment_note;
    this.editModel.phoneNo = this.appointment.phone_number;
  }

  close() {
    this.activeModal.close();
  }

  getScheduleData(data: any) {
    this.opScheduleSelected = data;
    let name = this.appointment.name;
    this.createAppInputData = {
      scheduleId: data.schedule_id,
      appointmentDate: data.date,
      name: name,
    };
  }

  getSlotData(data: any) {
    const app = this.appointment;
    const sch = this.opScheduleSelected;
    this.createAppBpjsPayload = {
      appointmentDate: sch.date,
      appointmentFromTime: data.appointment_from_time,
      appointmentToTime: data.appointment_to_time,
      appointmentNo: data.appointment_no,
      hospitalId: data.hospital_id,
      doctorId: sch.doctor_id,
      scheduleId: sch.schedule_id,
      isWaitingList: data.is_waiting_list,
      name: app.name,
      birthDate: app.birthDate,
      phoneNumber1: app.phoneNumber1,
      addressLine1: app.addressLine1,
      channelId: channelId.BPJS,
      isVerify: true,
      appointmentTemporaryId: app.appBpjsId,
      note: app.appointment_note,
      userId: this.user.id,
      userName: this.user.fullname,
      source: sourceApps,
    };

    app.patientHopeId ? this.createAppBpjsPayload.patientHopeId = app.patientHopeId : '';
  }

  async updateAppointment() {
    if (this.createAppBpjsPayload) {
      await this.createAppointmentBpjs();
    }
  }

  async createAppointmentBpjs() {
    await this.appointmentService.addAppointment(this.createAppBpjsPayload).toPromise().then(
      data => {
        this.alertService.success('Success to create appointment', false, 3000);
        this.appointmentService.emitCreateApp(true);
        setTimeout(() => { this.close(); }, 2000);
      }, err => {
        this.alertService.error(err.error.message, false, 3000);
      }
    );
  }

  cssAlertType(alert: Alert) {
    if (!alert) {
      return;
    }

    switch (alert.type) {
      case AlertType.Success:
        return 'success';
      case AlertType.Error:
        return 'danger';
      case AlertType.Info:
        return 'info';
      case AlertType.Warning:
        return 'warning';
    }
  }
}

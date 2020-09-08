import * as moment from 'moment';
import { Component, OnInit, Input } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../services/appointment.service';
import { editContactPayload } from '../../../payloads/edit-contact.payload';
import { sourceApps, channelId, consultationType } from '../../../variables/common.variable';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Doctor } from '../../../models/doctors/doctor';
import { AlertService } from '../../../services/alert.service';
import { Speciality } from '../../../models/specialities/speciality';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { dateFormatter } from '../../../utils/helpers.util';
import { isEmpty } from 'lodash';
import { PatientService } from '../../../services/patient.service';

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
  public appointment: any = {};
  public editContactPayload: editContactPayload;
  public rescheduleAppPayload: any;
  public editModel: any = {};
  public isReschedule: boolean = false;
  public flag: string = 'none';
  public flagTwo: string = 'none';
  public dateConvert: any;
  public appBPJS: boolean = true;
  public openWidgetCreateApp: boolean = false;

  public doctorList: any;
  public doctorBySpecialty: any;
  public specialtyDoctor: any = null;
  public alerts: Alert[] = [];
  public model: any = { speciality: '', doctor: '' };
  public specialities: Speciality[];
  public searchKeywords: any = {
    doctor: {},
    area: {},
    hospital: {},
    speciality: {}
  };
  public modelTwo: any = { hospital_id: '', name: '', mr: '', doctor: '', modifiedName: '',
   iswaitingList: '' };
  public doctorVal: any;
  public openWidget: boolean = false;

  public searchAutoComplete: any;
  public isReschNonBpjs: boolean = false;
  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private activeModal: NgbActiveModal,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
  ) { }

  async ngOnInit() {
    await this.getAppointmentById();
    await this.getListDoctorBySpecialty();
    await this.getListDoctor();
    await this.getSpecialities();
  }

  async getListDoctorBySpecialty() {

    this.alerts = [];
    this.specialtyDoctor = this.appointmentSelected.speciality_id;

    this.doctorBySpecialty = await this.doctorService.getDoctorBySpeciality(
      this.hospital.id,
      this.specialtyDoctor
      )
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        this.alertService.error(err.error.message);
        return [];
      });
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

  rescheduleToNonBpjs(){
    this.isReschNonBpjs = this.isReschNonBpjs ? false : true;
    this.doctorVal = null;
    this.searchKeywords = {
      doctor: {},
      area: {},
      hospital: {},
      speciality: {}
    };
    this.flag = 'none';
    this.doctorService.searchDoctorSource2 = null;
    this.openWidgetCreateApp = false;
  }

  async searchSchedule1(item?) {
    this.openWidgetCreateApp = false;
    this.model.speciality = '';
    let doctorId = null;
    let doctorName = null;
    let specialty = null;
    if(item) { //non bpjs
      this.appBPJS = false;
      this.flag = 'none';
      this.flagTwo = 'block';
      doctorId = item.doctor_id;
      doctorName = item.name;
      specialty = item.specialty_id;
    } else { //bpjs
      this.appBPJS = true;
      this.flag = 'block';
      this.flagTwo = 'none';
      doctorId = this.doctorVal.doctor_id;
      doctorName = this.doctorVal.name;
      specialty = this.doctorVal.specialty_id;
    }

    this.searchKeywords = {
      doctor: {
        doctor_id: doctorId,
        name: doctorName
      },
      hospital: {
        hospital_id: this.hospital.id,
        name: this.hospital.name,
      },
      speciality: {
        speciality_id: specialty,
      },
      fromBpjs: item ? null : true,
      fromRegistration: item ? null : true,
      isRescheduleBpjs: item ? null : true,
      consulType: item ? null : consultationType.BPJS+':'+consultationType.BPJS_REGULER,
      original: false
    };

    const searchKey = {
      type: 'doctor',
      doctor_id: doctorId,
      name: doctorName
    };

    localStorage.setItem('searchKey', JSON.stringify(searchKey));

    this.doctorService.changeSearchDoctor(this.searchKeywords);
    this.doctorService.searchDoctorSource2 = this.searchKeywords;
    this.openWidget = true;
  }

  searchSchedule2() {
    this.openWidgetCreateApp = false;
    this.appBPJS = false;
    this.flag = 'none';
    this.flagTwo = 'block';
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
      original: false
    };

    const searchKey = {
      type: 'spesialist',
      speciality_id: speciality.speciality_id,
      speciality_name: speciality.speciality_name,
    };

    localStorage.setItem('searchKey', JSON.stringify(searchKey));

    this.doctorService.changeSearchDoctor(this.searchKeywords);
    this.doctorService.searchDoctorSource2 = this.searchKeywords;
    this.openWidget = true;
  }

  async getAppointmentById() {
    const app = this.appointmentSelected;
    this.appointmentService.getAppointmentById(app.appointment_id).subscribe(
      data => {
        this.appointment = data.data[0];
        this.appointment.birth_date = moment(this.appointment.birth_date).format('DD-MM-YYYY');
        this.appointment.created_date = moment(this.appointment.created_date).format('DD-MM-YYYY');
        this.appointment.modified_date = moment(this.appointment.modified_date).format('DD-MM-YYYY');
        this.appointment.appointment_date = moment(this.appointment.appointment_date).format('DD-MM-YYYY');
        this.appointment.from_time = this.appointment.from_time.substring(0, 5);
        this.appointment.to_time = this.appointment.to_time.substring(0, 5);
        this.rescheduleSelected.note = this.appointment.appointment_note;
      }
    );
  }

  close() {
    this.activeModal.close();
  }

  getScheduleData(data: any) {
    this.openWidgetCreateApp = true;
    this.opScheduleSelected = data;
    let name = this.appointment.contact_name;
    name = name ? name : this.appointment.patient_name;
    if(this.appBPJS === true) {
      this.createAppInputData = {
        appointmentDate: data.date,
        name: name,
        doctorId: data.doctor_id,
        consulType: consultationType.BPJS+':'+consultationType.BPJS_REGULER,
        isRescheduleBpjs: true
      };
    } else {
      this.createAppInputData = {
        appointmentDate: data.date,
        name: name,
        doctorId: data.doctor_id
      };
    }  
  }

  getSlotData(data: any) {
    const app = this.appointmentSelected;
    const sch = this.opScheduleSelected;
    this.rescheduleAppPayload = {
      appointmentId: app.appointment_id,
      scheduleId: data.schedule_id,
      appointmentDate: sch.date,
      appointmentFromTime: data.appointment_from_time,
      appointmentToTime: data.appointment_to_time,
      appointmentNo: data.appointment_no,
      channelId: this.appBPJS === true ? channelId.BPJS : channelId.FRONT_OFFICE,
      hospitalId: data.hospital_id,
      isWaitingList: data.is_waiting_list,
      doctorId: data.doctor_id,
      note: this.rescheduleSelected.note,
      userId: this.user.id,
      userName: this.user.fullname,
      source: sourceApps
    };

    app.patientHopeId ? this.rescheduleAppPayload.patientHopeId = app.patientHopeId : '';
  }

  async updateAppointment() {
    const app = this.appointmentSelected;

    if (app.appointment_id) {
      if (this.editModel.phoneNo) {
        await this.updateContact();
      }
      if (this.rescheduleAppPayload) {
        await this.rescheduleAppointment();
      }
      if (this.rescheduleSelected.note !== this.appointmentSelected.appointment_note) {
        await this.updateNotes();
      }
    }
  }

  async updateNotes() {
    const appointmentId = this.appointmentSelected.appointment_id;
    const model = {
      notes: this.rescheduleSelected.note,
      userName: this.user.fullname,
      userId: this.user.id,
      source: sourceApps,
    };

    await this.appointmentService.updateAppNotes(appointmentId, model).subscribe(
      (data) => {
        this.appointmentService.emitUpdateNotes(true);
      }, error => {
        this.appointmentService.emitUpdateNotes(false);
      }
    );
  }

  async rescheduleAppointment() {
    this.appointmentService.addRescheduleAppointment(this.rescheduleAppPayload).toPromise().then(
      data => {
        this.appointmentService.emitRescheduleApp(true);
      }, error => {
        this.appointmentService.emitRescheduleApp(error.error.message);
      }
    );
  }

  async updateContact() {
    const contactId = this.appointment.contact_id;
    this.editContactPayload = {
      contactId: this.appointment.contact_id,
      data: {
        phoneNumber1: this.editModel.phoneNo,
      },
      userName: this.user.fullname,
      userId: this.user.id,
      source: sourceApps,
    };
    await this.patientService.updateContact(contactId, this.editContactPayload).subscribe(
      (data) => {
        this.patientService.emitUpdateContact(true);
      }, error => {
        this.patientService.emitUpdateContact(false);
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
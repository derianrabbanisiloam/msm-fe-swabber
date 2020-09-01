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
  public dateConvert: any;

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
  public doctorVal: any;

  public showSchedule: boolean = false;
  public searchAutoComplete: any;
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
    await this.getListDoctor();
    await this.getSpecialities();
  }

  async getListDoctor() {

    this.alerts = [];
    let index;

    this.doctorList = await this.doctorService.getListDoctor(this.hospital.id)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        this.alertService.error(err.error.message);
        return [];
      });
    
    index = this.doctorList.findIndex((a) => {
      return a.doctor_id == this.appointment.doctor_id;
    })
    this.specialtyDoctor = this.doctorList[index].specialty_id;

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

  searchSchedule1() {
    this.flag = 'block';
    this.model.speciality = '';

    this.searchKeywords = {
      doctor: {
        doctor_id: this.doctorVal.doctor_id,
        name: this.doctorVal.name
      },
      hospital: {
        hospital_id: this.hospital.id,
        name: this.hospital.name,
      },
      speciality: {
        speciality_id: this.doctorVal.specialty_id,
      },
      fromBpjs: true,
      fromRegistration: true,
      isRescheduleBpjs: true,
      consulType: consultationType.BPJS+':'+consultationType.BPJS_REGULER,
      original: false
    };

    const searchKey = {
      type: 'doctor',
      doctor_id: this.doctorVal.doctor_id,
      name: this.doctorVal.name
    };

    localStorage.setItem('searchKey', JSON.stringify(searchKey));

    this.doctorService.changeSearchDoctor(this.searchKeywords);
    this.doctorService.searchDoctorSource2 = this.searchKeywords;
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
    this.opScheduleSelected = data;
    let name = this.appointment.contact_name;
    name = name ? name : this.appointment.patient_name;
    this.createAppInputData = {
      appointmentDate: data.date,
      name: name,
      doctorId: data.doctor_id,
      consulType: consultationType.BPJS+':'+consultationType.BPJS_REGULER,
      isRescheduleBpjs: true
    };    
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
      channelId: channelId.BPJS,
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
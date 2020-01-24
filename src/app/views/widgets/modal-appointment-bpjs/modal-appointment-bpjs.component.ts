import * as moment from 'moment';
import { Component, OnInit, Input } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientService } from '../../../services/patient.service';
import { Appointment } from '../../../models/appointments/appointment';
import { editContactPayload } from '../../../payloads/edit-contact.payload';
import { rescheduleAppointmentPayload } from '../../../payloads/reschedule-appointment.payload';
import { sourceApps, channelId } from '../../../variables/common.variable';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Doctor } from '../../../models/doctors/doctor';
import { AlertService } from '../../../services/alert.service';
import { Speciality } from '../../../models/specialities/speciality';
import { Alert, AlertType } from '../../../models/alerts/alert';
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
    private patientService: PatientService,
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
    this.appointment = this.appointmentSelected;
  }

  close() {
    this.activeModal.close();
  }

  getScheduleData(data: any) {
    console.log('!!!!!!!!!!!!!!!!!!', data)
    this.opScheduleSelected = data;
    let name = this.appointmentSelected.contact_name;
    name = name ? name : this.appointmentSelected.patient_name;
    this.createAppInputData = {
      scheduleId: data.schedule_id,
      appointmentDate: data.date,
      name: name,
    };
  }

  getSlotData(data: any) {
    const app = this.appointmentSelected;
    const sch = this.opScheduleSelected;  
    console.log('!!!!!!!!!!!$$$$$$$$$', app);
    console.log('$$$$$$$$$$$$$$$', sch);
    console.log('###########', data)
    this.createAppBpjsPayload = {
      scheduleId: sch.schedule_id,
      appointmentDate: sch.date,
      appointmentFromTime: data.appointment_from_time,
      appointmentToTime: data.appointment_to_time,
      appointmentNo: data.appointment_no,
      channelId: channelId.FRONT_OFFICE,
      hospitalId: data.hospital_id,
      isWaitingList: data.is_waiting_list,
      note: this.rescheduleSelected.note,
      userId: this.user.id,
      userName: this.user.fullname,
      source: sourceApps,
    };

    // app.appointment_id ? this.rescheduleAppPayload.appointmentId = app.appointment_id :
    //   this.rescheduleAppPayload.appointmentTemporaryId = app.appointment_temporary_id;
  }

  openDoctorSchedule() {
    console.log('pertama', this.isOpenDoctorSchedule)
    console.log('!!!!!!!!!1234124', this.flag)
    this.isOpenDoctorSchedule = this.isOpenDoctorSchedule ? false : true;
    console.log('!!!!!!!!!!!!!!!!!!!!@$$$$$$$$$$', this.isOpenDoctorSchedule)
    this.flag = this.isOpenDoctorSchedule ? 'block' : 'none';
    console.log('!!!!!!!!!!!!!!!!!@@@@@@@@@@@@@', this.flag)
    this.opScheduleSelected = this.isOpenDoctorSchedule ? this.opScheduleSelected : null;
    const searchKeywords = {
      doctor: {
        doctor_id: this.appointmentSelected.doctor_id,
        name: this.appointmentSelected.doctor_name,
      },
      original: false,
    };
    this.doctorService.changeSearchDoctor(searchKeywords);
  }

  async updateAppointment() {
    if (this.createAppBpjsPayload) {
      await this.createAppointmentBpjs();
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

  async updateDetailTemporaryApp() {
    //to update detail of temporary appointment

    const tempAppId = this.appointmentSelected.appointment_temporary_id;
    const model = {
      phoneNumber: this.editModel.phoneNo,
      note: this.rescheduleSelected.note,
      userName: this.user.fullname,
      userId: this.user.id,
      source: sourceApps,
    };

    await this.appointmentService.updateDetailTemporaryApp(tempAppId, model).subscribe(
      (data) => {
        this.appointmentService.emitUpdateNotes(true);
      }, error => {
        this.appointmentService.emitUpdateNotes(false);
      }
    );
  }


}

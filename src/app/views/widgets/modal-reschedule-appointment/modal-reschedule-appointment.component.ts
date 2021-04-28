import * as moment from 'moment';
import { Component, OnInit, Input } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../services/appointment.service';
import { ScheduleService } from '../../../services/schedule.service';
import { PatientService } from '../../../services/patient.service';
import { editContactPayload } from '../../../payloads/edit-contact.payload';
import { sourceApps, channelId, consultationType } from '../../../variables/common.variable';
import { environment } from '../../../../environments/environment';
import { Speciality } from '../../../models/specialities/speciality';
import { isEmpty } from 'lodash';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-modal-reschedule-appointment',
  templateUrl: './modal-reschedule-appointment.component.html',
  styleUrls: ['./modal-reschedule-appointment.component.css']
})
export class ModalRescheduleAppointmentComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  @Input() appointmentSelected: any;
  @Input()
  public teleAppointmentData: TeleRescheduleAppointmentData = {
    isTele: false,
    appointment: null,
  };
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public isBpjsUnlock = this.key.hospital.isBpjs;

  public alerts: Alert[] = [];
  public opScheduleSelected: any;
  public opSlotSelected: any;
  public createAppInputData: any = {};
  public rescheduleSelected: any = {};
  public isOpenDoctorSchedule: boolean = false;
  public appointment: any = {};
  public editContactPayload: editContactPayload;
  public rescheduleAppPayload: any;
  public editModel: any = {};
  public flag: string = 'none';
  public flagTwo: string = 'none';
  public isReschBpjs: boolean = false;
  public doctorList: any;
  public model: any = { speciality: '', doctor: '' };
  public specialities: Speciality[];
  public searchKeywords: any = {
    doctor: {},
    area: {},
    hospital: {},
    speciality: {}
  };
  public openWidget: boolean = false;
  public openWidgetCreateApp: boolean = false;
  public appToBPJS: boolean = false;
  public directBPJS: boolean = false;
  public specialtyDoctor: any = null;
  public doctorBySpecialty: any;

  public doctorVal: any;
  public doctorValNonBpjs: any;
  public consultationTypeIds = null;

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private activeModal: NgbActiveModal,
    private scheduleService: ScheduleService,
    private modalService: NgbModal,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if (this.teleAppointmentData.isTele) {
      this.appointment = {
        ...this.teleAppointmentData.appointment
      };
      this.appointmentSelected = {
        ...this.teleAppointmentData.appointment
      };
      this.isReschBpjs = false;
      this.isBpjsUnlock = false;
      this.consultationTypeIds = `${consultationType.TELECONSULTATION}:${consultationType.NON_BPJS_TELE}`;
    } else {
      this.getAppointmentById();
      this.getListDoctorBySpecialty();
    }
    this.getListDoctor();
    this.getSpecialities();
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

  openConfirmationModal(modal: any) {
    this.modalService.open(modal);
  }

  async directChangeToBPJS() {
    let app = this.appointmentSelected;
    this.rescheduleAppPayload = {
      appointmentId: app.appointment_id,
      scheduleId: app.schedule_id,
      appointmentDate: app.appointment_date,
      appointmentFromTime: app.from_time.substr(0,5),
      appointmentToTime: app.to_time.substr(0,5),
      appointmentNo: app.appointment_no,
      channelId: channelId.BPJS,
      hospitalId: app.hospital_id,
      isWaitingList: app.is_waiting_list,
      note: app.appointment_note,
      userId: this.user.id,
      userName: this.user.fullname,
      source: sourceApps
    };

    await this.rescheduleAppointment();
  }

  rescheduleToBpjs(){
    this.flag = 'none';
    this.openWidget = false;
    this.isReschBpjs = this.isReschBpjs ? false : true;
    this.isOpenDoctorSchedule = false;
    this.searchKeywords = {
      doctor: {},
      area: {},
      hospital: {},
      speciality: {}
    };
    this.doctorService.searchDoctorSource2 = null;
    this.openWidgetCreateApp = false;
  }

  getListDoctor() {
    this.doctorService.getListDoctor(this.hospital.id)
      .subscribe(res => {
        this.doctorList = res.data;
        if (this.teleAppointmentData.isTele) {
          this.doctorBySpecialty = res.data
            .filter(e => e.doctor_id === this.teleAppointmentData.appointment.doctor_id);
          this.doctorList = [...this.doctorBySpecialty];
          this.doctorValNonBpjs = this.doctorList.length > 0 ? this.doctorList[0] : null;
          this.searchSchedule1(false);
        }
      }, err => {
        this.doctorList = [];
      });
  }

  async getSpecialities(specialityname = null, total = null) {
    this.specialities = await this.doctorService.getSpecialities(specialityname, total)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        return [];
      });

    if (this.specialities.length !== 0) {
      this.specialities.map(x => {
        x.speciality_name = isEmpty(x.speciality_name) ? '' : x.speciality_name;
      });
    }
  }

  searchSchedule1(isBpjs) {
    this.openWidgetCreateApp = false;
    this.model.speciality = '';
    let doctorId = null;
    let doctorName = null;
    let specialty = null;
    if(isBpjs === false) { //non bpjs
      this.doctorVal = null;
      this.appToBPJS = false;
      this.flag = 'block';
      this.flagTwo = 'none';
      doctorId = this.doctorValNonBpjs.doctor_id;
      doctorName = this.doctorValNonBpjs.name;
      specialty = this.doctorValNonBpjs.specialty_id;
    } else { //bpjs
      this.doctorValNonBpjs = null;
      this.appToBPJS = true;
      this.flag = 'none';
      this.flagTwo = 'block';
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
      fromBpjs: isBpjs === false ? null : true,
      fromRegistration: isBpjs === false ? null : true,
      isRescheduleBpjs: isBpjs === false ? null : true,
      consulType: isBpjs === false ? null : consultationType.BPJS+':'+consultationType.BPJS_REGULER,
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

  async getAppointmentById() {
    const app = this.appointmentSelected;

    this.scheduleService.scheduleDetail(this.appointmentSelected.schedule_id).subscribe(
      data => {
        if(data.data.consultation_type_id === '5') this.directBPJS = true;
      }
    );

    if (app.appointment_id) {
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
    } else {
      this.appointment = {
        appointment_temp_id: app.appointment_temporary_id,
        contact_name: app.contact_name,
        medical_record_number: null,
        birth_date: moment(app.date_of_birth).format('DD-MM-YYYY'),
        appointment_date: moment(app.appointment_date).format('DD-MM-YYYY'),
        from_time: app.appointment_from_time.substr(0, 5),
        to_time: app.appointment_to_time.substr(0, 5),
        doctor_name: app.doctor_name,
        is_waiting_list: app.is_waiting_list,
        queue_number: null,
        appointment_note: app.note,
        phone_number: app.phone_number,
        created_name: app.created_name,
        created_date: moment(app.created_date).format('DD-MM-YYYY'),
        modified_name: app.modified_name,
        modified_date: moment(app.modified_date).format('DD-MM-YYYY'),

      }
      this.rescheduleSelected.note = this.appointment.appointment_note;
      this.editModel.phoneNo = this.appointment.phone_number;
    }
  }

  close() {
    this.activeModal.close();
  }

  getScheduleData(data: any) {
    this.openWidgetCreateApp = true;
    this.opScheduleSelected = data;
    let name = this.appointmentSelected.contact_name;
    name = name ? name : this.appointmentSelected.patient_name;
    if(this.appToBPJS === true) {
      this.createAppInputData = {
        appointmentDate: data.date,
        name,
        doctorId: data.doctor_id,
        consulType: consultationType.BPJS+':'+consultationType.BPJS_REGULER,
        isRescheduleBpjs: true
      };
    } else {
      this.createAppInputData = {
        appointmentDate: data.date,
        name,
        doctorId: data.doctor_id,
        consulType: this.consultationTypeIds
      };
    }
  }

  getSlotData(data: any) {
    const app = this.appointmentSelected;
    const sch = this.opScheduleSelected;
    this.rescheduleAppPayload = {
      scheduleId: data.schedule_id,
      appointmentDate: sch.date,
      appointmentFromTime: data.appointment_from_time,
      appointmentToTime: data.appointment_to_time,
      appointmentNo: data.appointment_no,
      channelId: this.appToBPJS === true ? channelId.BPJS : channelId.FRONT_OFFICE,
      hospitalId: data.hospital_id,
      isWaitingList: data.is_waiting_list,
      note: this.rescheduleSelected.note,
      userId: this.user.id,
      userName: this.user.fullname,
      source: sourceApps,
    };

    this.appToBPJS === true ? this.rescheduleAppPayload.doctorId = data.doctor_id : '';
    app.appointment_id ? this.rescheduleAppPayload.appointmentId = app.appointment_id :
      this.rescheduleAppPayload.appointmentTemporaryId = app.appointment_temporary_id;
  }

  openDoctorSchedule() {
    this.doctorVal = null;
    this.isReschBpjs = false;
    this.appToBPJS = false;
    this.openWidgetCreateApp = false;
    this.doctorService.searchDoctorSource2 = null;
    this.isOpenDoctorSchedule = this.isOpenDoctorSchedule ? false : true;
    this.flag = this.isOpenDoctorSchedule ? 'block' : 'none';
    this.flagTwo = 'none';
    this.opScheduleSelected = this.isOpenDoctorSchedule ? this.opScheduleSelected : null;
    const searchKeywords = {
      doctor: {
        doctor_id: this.appointmentSelected.doctor_id,
        name: this.appointmentSelected.doctor_name,
      },
      original: false,
    };
    this.doctorService.changeSearchDoctor(searchKeywords);
    this.doctorService.searchDoctorSource2 = searchKeywords;
    this.openWidget = true;
  }

  async updateAppointment() {
    if (this.teleAppointmentData.isTele) {
      this.appointmentService.rescheduleApptTele({
        appointmentId: this.teleAppointmentData.appointment.appointment_id,
        appointmentDate: this.rescheduleAppPayload.appointmentDate,
        appointmentFromTime: this.rescheduleAppPayload.appointmentFromTime,
        appointmentToTime: this.rescheduleAppPayload.appointmentToTime,
        scheduleId: this.rescheduleAppPayload.scheduleId,
        channelId: this.teleAppointmentData.appointment.channel_id,
        userName: this.user.fullname,
        userId: this.user.id,
        source: sourceApps,
      })
        .subscribe(response => {
          if (response.status === 'OK') {
            this.appointmentService.emitRescheduleApp(true);
          } else {
            this.appointmentService.emitRescheduleApp(response.message);
          }
        }, error => {
          this.appointmentService.emitRescheduleApp(error.error.message);
        });
      return;
    }
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
    } else {
      if (this.rescheduleAppPayload) {
        await this.rescheduleAppointment();
      }
      await this.updateDetailTemporaryApp();
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

export interface TeleRescheduleAppointmentData {
  isTele: boolean;
  appointment: any;
}

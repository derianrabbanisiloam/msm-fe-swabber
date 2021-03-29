import * as moment from 'moment';
import { Component, OnInit, Input } from '@angular/core';
// import { DoctorService } from '../../../services/doctor.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../services/appointment.service';
import { ScheduleService } from '../../../services/schedule.service';
import { PatientService } from '../../../services/patient.service';
import { Appointment } from '../../../models/appointments/appointment';
import { editContactPayload } from '../../../payloads/edit-contact.payload';
import { rescheduleAppointmentPayload } from '../../../payloads/reschedule-appointment.payload';
import { sourceApps, channelId, consultationType, hospitalId } from '../../../variables/common.variable';
import { environment } from '../../../../environments/environment';
import { Speciality } from '../../../models/specialities/speciality';
import { isEmpty } from 'lodash';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { AlertService } from '../../../services/alert.service';
import { CheckupService } from '../../../services/checkup.service';
import { DoctorService } from '../../../services/doctor.service';
import { patientStatus } from '../../../variables/common.variable';

@Component({
  selector: 'app-modal-reschedule-checkup',
  templateUrl: './modal-reschedule-checkup.component.html',
  styleUrls: ['./modal-reschedule-checkup.component.css']
})
export class ModalRescheduleCheckupComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  @Input() appointmentSelected: any;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public patientStatus: any = patientStatus;
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
  public modifiedDate;
  public createdDate;
  public checkupCategoriesList;
  public showSchedule: boolean = false;
  public checkupCategoryVal: any;
  public doctorValNonBpjs: any;
  public appData: any;
  public flagDisable: boolean = false;

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private checkupService: CheckupService,
    private alertService: AlertService,
    private doctorService: DoctorService,
  ) { }

  async ngOnInit() {
    this.getAppIdbyRegFormId();
    this.getCheckupCategoriesList();
    this.modifiedDate = moment(this.appointmentSelected.modified_date).format('DD-MM-YYYY');
    this.createdDate = moment(this.appointmentSelected.created_date).format('DD-MM-YYYY');
    this.rescheduleSelected.note = this.appointmentSelected.note;
    this.editModel.phoneNo = this.appointmentSelected.phone_number_1;
  }

  async getAppIdbyRegFormId() {
    let regisFormId = this.appointmentSelected.registration_form_id ? this.appointmentSelected.registration_form_id : null;
    if(regisFormId) {
      this.appData = await this.appointmentService.getAppointmentByRegisFormId(regisFormId).toPromise()
      .then(res => {
        if(res.data.length > 0) {
          this.flagDisable = false;
          return res.data;
        } else {
          this.flagDisable = true;
          return null
        }
        }).catch(err => {
          this.flagDisable = true;
          return null;
        });
    }
  }

  async getCheckupCategoriesList() {
    this.checkupCategoriesList = await this.checkupService.getCategory(this.hospital.id)
      .toPromise().then(res => {
        let body = [];
        for (let i = 0, { length } = res.data; i < length; i += 1) {
          if(res.data[i].checkup_type_id === '2') {
            body.push(res.data[i])
          }
        }
        return body;
      }).catch(err => {
        this.alertService.error(err.error.message);
        return [];
      });
  }

  openConfirmationModal(modal: any) {
    this.modalService.open(modal);
  }

  close() {
    this.activeModal.close();
  }

  async updateAppointment() {
    const app = this.appointmentSelected;

    if (app.appointment_id) {
      if (this.editModel.phoneNo !== this.appointmentSelected.phone_number_1) {
        await this.updateContact();
      }
      if (this.rescheduleAppPayload) {
        await this.rescheduleAppointment();
      }
      if (this.rescheduleSelected.note !== this.appointmentSelected.note) {
        await this.updateNotes();
      }
    } else {
      if (this.rescheduleAppPayload) {
        await this.rescheduleAppointment();
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
      isCovid: true
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
    this.appointmentService.addRescheduleAppointmentVaccine(this.rescheduleAppPayload).toPromise().then(
      data => {
        this.appointmentService.emitRescheduleApp(true);
      }, error => {
        this.appointmentService.emitRescheduleApp(error.error.message);
      }
    );
  }

  async updateContact() {
    const contactId = this.appointmentSelected.contact_id;
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

  async searchCheckupCategories() {
    this.openWidgetCreateApp = false;

    this.searchKeywords = {
      checkup: {
        checkup_id: this.checkupCategoryVal.checkup_id,
        checkup_name: this.checkupCategoryVal.checkup_name
      },
      vaccinePatData: this.appointmentSelected,
      fromVaccineWorklist: true,
      original: false
    };

    let searchKey = {
      type: 'params',
      checkup_id: this.checkupCategoryVal.checkup_id,
      checkup_name: this.checkupCategoryVal.checkup_name,
    };

    localStorage.setItem('searchKey', JSON.stringify(searchKey));

    this.doctorService.changeSearchDoctor(this.searchKeywords);
    this.doctorService.searchDoctorSource2 = this.searchKeywords;

    this.showSchedule = true;
  }


  getScheduleData(data: any) {
    this.openWidgetCreateApp = true;
    this.opScheduleSelected = data;
    let name = this.appointmentSelected.name;
    this.createAppInputData = {
      appointmentDate: data.date,
      name: name,
      checkupId: data.checkup_id,
      checkupName: data.checkup_name,
      checkUpScheduleId: data.checkup_schedule_id
    };
  }

  getSlotData(data: any) {
    const app = this.appointmentSelected;
    const sch = this.opScheduleSelected;
    let isWalkin;

    if (app.is_walkin) {
      if (this.appointmentSelected.appointment_date === moment(this.opScheduleSelected.date).format('DD-MM-YYYY')) {
        isWalkin = true;
      } else {
        isWalkin = false
      }
    } else {
      isWalkin = false
    }

    this.rescheduleAppPayload = {
      appointmentId: this.appData[0].appointment_id ? this.appData[0].appointment_id : null,
      channelId: this.appData[0].channel_id ? this.appData[0].channel_id : '2',
      appointmentDate: sch.date,
      appointmentFromTime: sch.from_time,
      appointmentToTime: sch.to_time,
      checkUpScheduleId: sch.checkup_schedule_id,
      isWalkin,
      hospitalId: this.hospital.id,
      checkUpId: sch.checkup_id,
      note: app.note,
      userName: this.user.fullname,
      userId: this.user.id,
      source: sourceApps,
    };
  }
}

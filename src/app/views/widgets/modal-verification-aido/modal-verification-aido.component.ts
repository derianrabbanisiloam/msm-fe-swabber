import * as moment from 'moment';
import { Component, OnInit, Input } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { DoctorService } from '../../../services/doctor.service';
import { ScheduleService } from '../../../services/schedule.service';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientHope } from '../../../models/patients/patient-hope';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { contactPayload } from '../../../payloads/contact.payload';
import { appointmentTemporaryPayload } from '../../../payloads/appointment-temporary.payload';
import { patientPayload } from '../../../payloads/patient.payload';
import { channelId, sourceApps } from '../../../variables/common.variable';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { ModalRescheduleAppointmentComponent } from '../modal-reschedule-appointment/modal-reschedule-appointment.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-modal-verification-aido',
  templateUrl: './modal-verification-aido.component.html',
  styleUrls: ['./modal-verification-aido.component.css']
})
export class ModalVerificationAidoComponent implements OnInit {

  @Input() appointmentAidoSelected: any;
  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public searchPatientModel: any;
  public maskBirth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public patientHope: PatientHope[];
  public searchLoader: boolean = false;
  public patientSelected: any;
  public userId: string = this.user.id;
  public userName: string = this.user.fullname;
  public source: string = sourceApps;
  public isSuccessCreateContact: boolean = false;
  public isSuccessVerifyApp: boolean = false;
  public createContactMsg: string;
  public contactId: string;
  public alerts: Alert[] = [];
  public flagConfirm: boolean = false;
  public dataDoctor: any;
  public specialist: any;
  public schedule: any;
  public doctorNotes: any = [];
  public confirmReschedule: boolean;
  public appointment: any = {};
  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private alertService: AlertService,
    private doctorService: DoctorService,
    private scheduleService: ScheduleService
  ) { }

  async ngOnInit() {
    console.log("this.appointmentAidoSelected", this.appointmentAidoSelected)
    await this.compareCondition();
    await this.searchPatient();
    await this.getCollectionAlert();
    await this.getDoctorProfile();
  }

  async compareCondition(){
    if(!this.appointmentAidoSelected.from_worklist){
      this.appointmentAidoSelected.contact_name = this.appointmentAidoSelected.patient_name;
    }

    if (!this.searchPatientModel) {
      this.searchPatientModel = {
        patientName: this.appointmentAidoSelected.contact_name,
        patientBirth: this.appointmentAidoSelected.date_of_birth,
        hospitalId: this.appointmentAidoSelected.hospital_id,
      };
    }
  }

  async getDoctorProfile() {
    const hospitalId = this.appointmentAidoSelected.hospital_id;
    const doctorId = this.appointmentAidoSelected.doctor_id;
    this.doctorService.getDoctorProfileTwo(hospitalId, doctorId).subscribe(
      data => {
        this.dataDoctor = data.data;
        this.specialist = this.dataDoctor.specialization_name_en;
      }
    )
  }

  async searchPatient() {
    this.searchLoader = true;
    if (!this.searchPatientModel) {
      this.searchPatientModel = {
        patientName: this.appointmentAidoSelected.contact_name,
        patientBirth: this.appointmentAidoSelected.date_of_birth,
        hospitalId: this.appointmentAidoSelected.hospital_id,
      };
    }
    const hospitalId = this.searchPatientModel.hospitalId;
    const patientName = this.searchPatientModel.patientName;
    const dob = this.searchPatientModel.patientBirth.split('-');
    const birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];

    this.patientService.searchPatientHope1(hospitalId, patientName, birthDate).subscribe(
      data => {
        this.searchLoader = false;
        this.patientHope = data.data;
      }
    )
  }

  setVerifyPatient(patient: any) {
    this.patientSelected = patient;
  }

  openConfirmationModal(modal: any) {
    this.modalService.open(modal);
  }

  createContact() {
    const app = this.appointmentAidoSelected;
    const payload: contactPayload = {
      name: app.contact_name,
      birthDate: app.date_of_birth,
      phoneNumber1: app.phone_number,
      channelId: app.channel_id.toString(),
      emailAddress: app.email_address,
      cityId: app.city_id,
      countryId: app.country_id,
      districtId: app.district_id,
      subDistrictId: app.sub_district_id,
      currentAddress: app.address_line_1,
      genderId: app.gender_id,
      religionId: app.religion_id,
      identityTypeId: app.identity_id,
      identityNumber: app.identity_number,
      identityAddress: app.identity_address,
      phoneNumber2: app.phone_number,
      stateId: app.state_id,
      userId: this.userId,
      source: this.source,
    };
    this.patientService.addContact(payload).subscribe(
      data => {
        this.isSuccessCreateContact = true;
        this.patientHope = [];
        this.contactId = data.data.contact_id;
      }, error => {
        this.createContactMsg = 'Gagal create new contact';
      }
    );
  }

  async verifyPatient() {
    this.flagConfirm = true;
    const app = this.appointmentAidoSelected;
    const payload = {
      patientHopeId: this.patientSelected.patientId,
      contactId: app.contact_id ? app.contact_id : null,
      hospitalId: app.hospital_id,
      channelId: channelId.AIDO,
      userId: this.userId,
      source: this.source
    };

    await this.patientService.verifyPatient(payload).toPromise().then(
      data => {
        this.isSuccessVerifyApp = true;
        this.flagConfirm = false;
        this.contactId = data.data.contact_id;
        this.alertService.success('Verifikasi appointment berhasil');
        this.appointmentService.emitVerifyApp(true);
      }, error => {
        this.flagConfirm = false;
        this.alertService.error('Gagal verifikasi appointment');
      }
    );
  }

  async createPatient() {
    this.flagConfirm = true;
    const app = this.appointmentAidoSelected;
    const contactId = app.contact_id;
    const payload = {
      channelId: channelId.AIDO,
      hospitalId: this.hospital.id,
      appointmentAidoId: app.appointment_id,
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.fullname,
    };

    await this.patientService.createPatientByContactId(contactId, payload).toPromise().then(
      data => {
        this.isSuccessVerifyApp = true;
        this.flagConfirm = false;
        this.alertService.success('Successfully create patient');
        this.appointmentService.emitVerifyApp(true);
      }, error => {
        this.flagConfirm = false;
        this.alertService.error('Failed create patient');
      }
    );
  }

  closeAll() {
    this.modalService.dismissAll();
  }

  async getCollectionAlert() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }
      // add alert to array
      this.alerts.push(alert);
    });
  }

  close() {
    this.activeModal.close();
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

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  openRescheduleModal(appointmentSelected: any) {
    const modalRef = this.modalService.open(ModalRescheduleAppointmentComponent,
      { windowClass: 'cc_modal_confirmation', size: 'lg' });
    modalRef.componentInstance.appointmentSelected = appointmentSelected;
  }

}

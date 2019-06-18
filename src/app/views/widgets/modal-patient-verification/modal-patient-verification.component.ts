import * as moment from 'moment';
import { Component, OnInit, Input} from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientHope } from '../../../models/patients/patient-hope';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { contactPayload } from '../../../payloads/contact.payload';
import { appointmentTemporaryPayload } from '../../../payloads/appointment-temporary.payload';
import { patientPayload } from '../../../payloads/patient.payload';
import { channelId, sourceApps } from '../../../variables/common.variable';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';

@Component({
  selector: 'app-modal-patient-verification',
  templateUrl: './modal-patient-verification.component.html',
  styleUrls: ['./modal-patient-verification.component.css']
})
export class ModalPatientVerificationComponent implements OnInit {

  @Input() tempAppointmentSelected: any;

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

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.searchPatient();
    this.getCollectionAlert();
  }

  searchPatient() {
    this.searchLoader = true;
    if (!this.searchPatientModel) {
      this.searchPatientModel = {
        patientName: this.tempAppointmentSelected.contact_name,
        patientBirth: moment(this.tempAppointmentSelected.date_of_birth).format('DD-MM-YYYY'),
        hospitalId: this.tempAppointmentSelected.hospital_id,
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
    const app = this.tempAppointmentSelected;
    const payload: contactPayload = {
      name: app.contact_name,
      birthDate: app.date_of_birth,
      phoneNumber1: app.phone_number,
      channelId: app.channel_id,
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
        console.log(data);
      }, error => {
        this.createContactMsg = 'Gagal create new contact';
      }
    );
  }

  async verifyPatient() {
    const app = this.tempAppointmentSelected;
    const payload: patientPayload = {
      patientHopeId: this.patientSelected.patientId,
      contactId: app.contact_id ? app.contact_id : null,
      hospitalId: app.hospital_id,
      userId: this.userId,
      source: this.source 
    };
    console.log(payload, "verifyPatient");
    const mappingPatient = await this.patientService.verifyPatient(payload).toPromise().then(
      data => {
        this.contactId = data.data.contact_id;
        console.log(data);
        return data.data;
      }
    );
    return mappingPatient;
  }

  public verifySubmit: boolean = false;
  async verifyTempAppointment() {
    const app = this.tempAppointmentSelected;
    if (!this.contactId) {
      await this.verifyPatient();
    }
    const contactId = this.contactId ? this.contactId : app.contact_id;
    const payload: appointmentTemporaryPayload = {
      appointmentTemporaryId: app.appointment_temporary_id,
      appointmentDate: app.appointment_date,
      appointmentFromTime: app.appointment_from_time,
      appointmentToTime: app.appointment_to_time,
      appointmentNo: app.appointment_no,
      isWaitingList: app.is_waiting_list,
      doctorId: app.doctor_id,
      hospitalId: app.hospital_id,
      scheduleId: app.schedule_id,
      contactId: contactId,
      addressLine1: app.address_line_1,
      channelId: app.channel_id.toString(),
      note: app.note,
      userId: this.userId,
      userName: this.userName,
      source: this.source
    };
    console.log(payload);
    await this.appointmentService.verifyAppointment(payload).toPromise().then(
      data => {
        this.isSuccessVerifyApp = true;
        this.alertService.success('Verifikasi appointment berhasil');
        this.appointmentService.emitVerifyApp(true);
        console.log(data);        
      }, error => {
        this.alertService.error('Gagal verifikasi appointment');
      }
    );
  }

  closeAll() {
    this.modalService.dismissAll();
  }

  async getCollectionAlert(){
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

}

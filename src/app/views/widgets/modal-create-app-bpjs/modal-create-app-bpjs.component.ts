import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { appointmentPayload } from '../../../payloads/appointment.payload';
import { AppointmentService } from '../../../services/appointment.service';
import { BpjsService } from '../../../services/bpjs.service';
import { PatientHope } from '../../../models/patients/patient-hope';
import { channelId, sourceApps } from '../../../variables/common.variable';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { environment } from '../../../../environments/environment';
import { PatientService } from '../../../services/patient.service';
import Swal from 'sweetalert2';
import { contactPayload } from '../../../payloads/contact.payload';

@Component({
  selector: 'app-modal-create-app-bpjs',
  templateUrl: './modal-create-app-bpjs.component.html',
  styleUrls: ['./modal-create-app-bpjs.component.css']
})
export class ModalCreateAppBpjsComponent implements OnInit {

  @Input() bpjsInfo: any;
  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public choosedPatient: PatientHope;
  public addAppPayload: appointmentPayload = new appointmentPayload;
  public model: any = {};
  public maskPhone = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  public mask_birth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public isLock: boolean = false;
  public isSubmitting: boolean = false;
  public userId: string = this.user.id;
  private userName: string = this.user.fullname;
  public source: string = sourceApps;
  public alerts: Alert[] = [];
  public doctorTypeFcfs: string = '1';
  public bpjsCardNumber: string = null;
  public bpjsBody: any;
  public messageBpjs: string = null;
  public searchPatient: boolean = false;
  public flagSearch: boolean = false;
  public loadingBar: boolean = false;
  public dateBirth: any;
  public patientHope: any = null;
  public mrLocal: any;
  public selectPatient: any;
  public patientName: any;
  public isSuccessCreateContact: boolean = false;
  public contactId: string;
  public createContactMsg: string;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private appointmentService: AppointmentService,
    private alertService: AlertService,
    private bpjsService: BpjsService,
    private patientService: PatientService
  ) { }

  ngOnInit() {
    this.bpjsCardNumber = this.bpjsInfo.patientBpjs.bpjs_card_number;
    this.bpjsBody = this.bpjsInfo.patientBpjs;

    this.getCollectionAlert();
    if (this.bpjsInfo.can_reserved.key 
      && this.bpjsInfo.doctor_type_id !== this.doctorTypeFcfs
      && this.bpjsInfo.is_waiting_list === false) {
      this.isLock = true;
      this.alertService.error('This slot is unavailable at this time, '
        + 'because there is other user using this slot now. '
        + 'Please try again 15 seconds later.', false, 10000);
    }
  }

  close() {
    this.activeModal.close();
  }

  async searchDataBPJS(){
    const { 
      patient_name,
      patient_birth_date,
      speciality_id
    } = this.bpjsBody;
    let split = patient_birth_date.split('-');
    let birthDate = split[2]+'-'+split[1]+'-'+split[0];
    await this.bpjsService.checkNoBpjs(
      this.hospital.id, 
      this.bpjsCardNumber, 
      patient_name,
      birthDate,
      speciality_id
      ).toPromise().then(
      data => {
        if(data.data.response === null) {
          this.messageBpjs = data.data.metaData.message;
        }
        else {
          this.messageBpjs = null;
        }
        console.log('data', data.data)
      }, err => {
        this.messageBpjs = null;
        this.alertService.error(err.error.message, false, 3000);
      }
    );
  }

  async createAppointment() {
    this.isSubmitting = true;
    const isValidForm = this.validateCreateAppointment();
    if (isValidForm === false) {
      this.isSubmitting = false;
      return false;
    }
    const data = this.bpjsInfo;
    const { patientName, phoneNumber, address, note } = this.model;
    const dob = this.model.birthDate.split('-');
    const birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];
    const patientHopeId = this.choosedPatient ? this.choosedPatient.patientId : null;
    this.addAppPayload = {
      appointmentDate: data.appointment_date,
      appointmentFromTime: data.appointment_from_time,
      appointmentToTime: data.appointment_to_time,
      appointmentNo: data.appointment_no,
      hospitalId: data.hospital_id,
      doctorId: data.doctor_id,
      scheduleId: data.schedule_id,
      isWaitingList: data.is_waiting_list,
      patientHopeId: patientHopeId,
      name: patientName,
      birthDate: birthDate,
      phoneNumber1: this.filterizePhoneNumber(phoneNumber),
      addressLine1: address,
      note: note,
      channelId: channelId.FRONT_OFFICE,
      userId: this.userId,
      userName: this.userName,
      source: this.source
    };

    await this.appointmentService.addAppointment(this.addAppPayload).toPromise().then(
      data => {
        this.alertService.success('Success to create appointment', false, 3000);
        this.appointmentService.emitCreateApp(true);
        setTimeout(() => { this.close(); }, 2000);
      }, err => {
        this.alertService.error(err.error.message, false, 3000);
      }
    );
    this.isSubmitting = false;
  }

  createContact() {
    const app = this.selectPatient;
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

  resetField() {
    this.isSubmitting = false;
    this.model = {};
    this.isLock = false;
  }

  validateCreateAppointment() {
    let isValid = true;
    const { patientName, phoneNumber } = this.model;
    if (!patientName) {
      $('.form-ca-patientname').addClass('form-error');
      isValid = false;
    } else {
      $('.form-ca-patientname').removeClass('form-error');
    }
    if (!phoneNumber) {
      $('.form-ca-phoneno').addClass('form-error');
      isValid = false;
    } else {
      $('.form-ca-phoneno').removeClass('form-error');
    }
    return isValid;
  }

  filterizePhoneNumber(phoneNumber: string) {
    phoneNumber = phoneNumber.replace(/_/gi, '');
    return phoneNumber;
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

  openModal(modal: any) {
    this.patientName = this.bpjsBody.patient_name;
    this.dateBirth = this.bpjsBody.patient_birth_date;
    this.patientHope = null;
    this.flagSearch = false;
    this.modalService.open(modal, { size: 'lg' });
  }

  getSearchedPatient1() {
    this.flagSearch = false;
    this.loadingBar = true;
    let date;
    date = moment(this.dateBirth, 'DD-MM-YYYY').format('YYYY-MM-DD');
    this.patientService.searchPatientAccessMr(this.patientName, date).subscribe(
      data => {
        this.selectPatient = null;
        this.loadingBar = false;
        this.flagSearch = true;
        let newData = data.data;
        if(newData.length){
          let birthDate;
          let dob;
          this.patientHope = newData;
          for (let i = 0, length = newData.length; i < length; i += 1){
            dob = this.patientHope[i].birthDate.split('-');
            birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];
            this.patientHope[i].newBirthDate = birthDate;
          }
        }
        else {
          this.loadingBar = false;
          this.flagSearch = true;
          this.patientHope = null;
        }
      }, error => {
        this.loadingBar = false;
        this.flagSearch = true;
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: error.error.message,
          timer: 4000
        })
      }
    )
  }

  getSearchedPatient2() {
    this.flagSearch = false;
    this.loadingBar = true;
    this.patientService.searchPatientAccessMr2(this.hospital.id, this.mrLocal).subscribe(
      data => {
        this.selectPatient = null;
        this.loadingBar = false;
        this.flagSearch = true;
        let newData = data.data;
        if(newData.length){
          let birthDate;
          let dob;
          this.patientHope = newData;
          for (let i = 0, length = newData.length; i < length; i += 1){
            dob = this.patientHope[i].birthDate.split('-');
            birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];
            this.patientHope[i].newBirthDate = birthDate;
          }
        }
        else {
          this.loadingBar = false;
          this.patientHope = null;
        }
      }, error => {
        this.loadingBar = false;
        this.flagSearch = true;
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: error.error.message,
          timer: 4000
        })
      }
    )
  }

  choosedSearchPatient(val) {
    this.selectPatient = val;
  }

}

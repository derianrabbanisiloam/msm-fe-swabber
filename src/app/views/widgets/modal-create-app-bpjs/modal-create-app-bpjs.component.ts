import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import * as moment from 'moment';
import { NgbModal, NgbActiveModal, NgbModalConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
import { dateFormatter } from '../../../utils/helpers.util';
import { DoctorService } from '../../../services/doctor.service';

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
  public addAppPayload: any;
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
  public nationalIdNo: string = null;
  public fromRegistration: boolean = false;
  public bpjsBody: any;
  public messageBpjs: string = null;
  public searchPatient: boolean = false;
  public flagSearch: boolean = false;
  public loadingBar: boolean = false;
  public dateBirth: any;
  public patientHope: any = null;
  public mrLocal: any;
  public selectPatient: any = null;
  public patientName: any;
  public isSuccessCreateContact: boolean = false;
  public contactId: string;
  public createContactMsg: string;
  public closeResult: string;
  public note: string = null;
  public bpjsData: any = null;
  //edit hope
  public patientHopeId: any;
  public phoneNumberOne: any;
  public phoneNumberTwo: any;
  public nameHope: any;
  public birthDateFormat: any;
  public addressHope: any;
  public postHope: any;
  public flagCountOne: boolean = false;
  public flagCountTwo: boolean = false;
  public loadingBut: boolean = false;
  public isRujukanInternal: boolean = false;
  public doctorId: string = null;
  public doctorList: any = null;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private appointmentService: AppointmentService,
    private alertService: AlertService,
    private bpjsService: BpjsService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    modalSetting: NgbModalConfig,
  ) {
    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
   }

  async ngOnInit() {
    console.log('bpjsinfo', this.bpjsInfo)
    if(this.bpjsInfo.fromBpjs === true && this.bpjsInfo.fromRegistration === false) {
      this.fromRegistration = false;
      this.bpjsCardNumber = this.bpjsInfo.patientBpjs.bpjs_card_number;
      this.bpjsBody = this.bpjsInfo.patientBpjs;
    } else if(this.bpjsInfo.fromBpjs === true && this.bpjsInfo.fromRegistration === true) {
      this.fromRegistration = true;
    }

    await this.getCollectionAlert();
    await this.getListDoctor();
    if (this.bpjsInfo.can_reserved.key 
      && this.bpjsInfo.doctor_type_id !== this.doctorTypeFcfs
      && this.bpjsInfo.is_waiting_list === false) {
      this.isLock = true;
      this.alertService.error('This slot is unavailable at this time, '
        + 'because there is other user using this slot now. '
        + 'Please try again 15 seconds later.', false, 10000);
    }
  }

  async getListDoctor() {
    this.doctorList = await this.doctorService.getDoctorBySpeciality(
      this.hospital.id, 
      this.bpjsInfo.speciality.speciality_id
      )
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        this.alertService.error(err.error.message);
        return [];
      });

      console.log('##########', this.doctorList)
  }

  rujukanInternalVal(e) {
    this.isRujukanInternal = this.isRujukanInternal ? true : false;
    if(this.isRujukanInternal === true) {
      document.getElementById('modal-bpjs').setAttribute('add-width-att', '');
      document.getElementById('modal-bpjs-2').setAttribute('add-width-att', '');
      document.getElementById('tutorial5').setAttribute('add-width-percent', '');
    } else {
      document.getElementById('modal-bpjs').removeAttribute('add-width-att');
      document.getElementById('modal-bpjs-2').removeAttribute('add-width-att');
      document.getElementById('tutorial5').removeAttribute('add-width-percent');
    }
  }

  close() {
    this.activeModal.close();
  }

  async searchDataBPJS(){
    let split;
    let birthDate = null;
    let patientName = null;
    let patientBirthDate = null;
    let specialityId = this.fromRegistration === true ? this.bpjsInfo.speciality.speciality_id : null;
    if(this.fromRegistration === false) {
      patientName = this.bpjsBody.patient_name;
      patientBirthDate = this.bpjsBody.patient_birth_date;
      specialityId = this.bpjsBody.speciality_id;
      split = patientBirthDate.split('-');
      birthDate = split[2]+'-'+split[1]+'-'+split[0];
    } else if(this.fromRegistration === true) {

    }
    
    var visitDate;
    var dateFix;
    let dateChoosed; 
    let bpjsDate;
    await this.bpjsService.checkNoBpjs(
      this.hospital.id, 
      this.bpjsCardNumber,
      this.nationalIdNo,
      patientName,
      birthDate,
      specialityId
      ).toPromise().then(
      data => {
        if(data.data.length) {
          this.bpjsData = data.data[0];
          this.bpjsData.map(x => {
            visitDate = x.tglKunjungan.split('-');
            dateFix = visitDate[2]+'-'+visitDate[1]+'-'+visitDate[0];
            dateChoosed = moment(dateFix); 
            bpjsDate = dateChoosed.add(90, 'days').format('YYYY-MM-DD');
            x.expiredDate = bpjsDate;
          });
        } else {
          this.bpjsData = null;
          this.messageBpjs = 'Tidak ada rujukan';
        }
      }, err => {
        this.bpjsData = null;
        this.messageBpjs = null;
        this.alertService.error(err.error.message, false, 3000);
      }
    );
  }

  async createAppointment() {
    this.isSubmitting = true;
    const data = this.bpjsInfo;
    const dataBpjs = this.bpjsInfo.patientBpjs;
    const patientHopeId = this.selectPatient ? this.selectPatient.patientId : null;
    const addressHope = this.selectPatient ? this.selectPatient.address : '';
    const splitDateBirth = dataBpjs.patient_birth_date.split('-');
    const fixDateBirth = splitDateBirth[2]+'-'+splitDateBirth[1]+'-'+splitDateBirth[0];
    this.addAppPayload = {
      appointmentTemporaryId: dataBpjs.appointment_bpjs_id,
      appointmentDate: data.appointment_date,
      appointmentFromTime: data.appointment_from_time,
      appointmentNo: data.appointment_no,
      hospitalId: dataBpjs.hospital_id,
      doctorId: data.doctor_id,
      scheduleId: data.schedule_id,
      isWaitingList: data.is_waiting_list,
      patientHopeId: patientHopeId,
      contactId: dataBpjs.contact_id,
      name: dataBpjs.patient_name,
      birthDate: fixDateBirth,
      phoneNumber1: this.filterizePhoneNumber(dataBpjs.phone_number_1),
      addressLine1: addressHope,
      note: this.note,
      channelId: channelId.BPJS,
      userId: this.userId,
      userName: this.userName,
      source: this.source,
      isVerify: true,
      //isInternalReference: dataBpjs.internal_reference,
      //doctorIdRefference: dataBpjs.doctor_id_refference

    };

    await this.appointmentService.addAppointment(this.addAppPayload).toPromise().then(
      data => {
        this.alertService.success('Success to create appointment', false, 3000);
        this.appointmentService.emitCreateApp(true);
        this.modalService.dismissAll();
        setTimeout(() => { this.close(); }, 2000);
      }, err => {
        this.alertService.error(err.error.message, false, 3000);
      }
    );
    this.isSubmitting = false;
  }

  async editPatientHopeId(val, content) {
    let body = await this.getPatientHopeId(val);
    if(body) {
      const { patientId, name, sexId, birthPlaceId, birthDate, titleId, maritalStatusId, address, cityId, districtId, 
              subDistrictId, postCode, homePhoneNo, officePhoneNo, mobileNo1, mobileNo2, emailAddress,
              permanentAddress, permanentCityId, permanentPostCode, nationalIdTypeId, nationalIdNo,
              nationalityId, religionId, bloodTypeId, fatherName, motherName, spouseName, contactName,
              contactAddress, contactCityId, contactPhoneNo, contactMobileNo, contactEmailAddress, allergy,
              payerId, payerIdNo, notes } = body;
            
      this.patientHopeId = patientId;

      let bodyTwo = {
        name, sexId, birthPlaceId, birthDate, titleId, maritalStatusId, address, cityId, districtId, 
        subDistrictId, postCode, homePhoneNo, officePhoneNo, mobileNo2, emailAddress,
        permanentAddress, permanentCityId, permanentPostCode, nationalIdTypeId, nationalIdNo,
        nationalityId, religionId, bloodTypeId, fatherName, motherName, spouseName, contactName,
        contactAddress, contactCityId, contactPhoneNo, contactMobileNo, contactEmailAddress, allergy,
        payerId, payerIdNo, notes, patientOrganizationId : val.patientOrganizationId, organizationId: val.hospitalId
        }

      this.phoneNumberOne = mobileNo1;
      this.phoneNumberTwo = mobileNo2;
      this.nameHope = name;
      this.addressHope = address;
      this.birthDateFormat = dateFormatter(birthDate, true);
      this.postHope = bodyTwo;
      this.checkCountChar();
      this.openLarge(content);
    }
  }

  confirmSavePhoneNumber(closeModal) {
    this.loadingBut = true;
    this.postHope.mobileNo1 = this.charRemove(this.phoneNumberOne);
    this.postHope.mobileNo2 = this.charRemove(this.phoneNumberTwo);
    this.postHope.channelId = channelId.FRONT_OFFICE;
    this.postHope.userId = this.user.id;
    this.postHope.source = sourceApps;
    this.postHope.userName = this.user.fullname;
    this.patientService.updatePatientComplete(this.postHope, this.patientHopeId).subscribe(
      data => {
        if(this.searchPatient === true) this.getSearchedPatient1();
        else this.getSearchedPatient2();
        this.loadingBut = false;
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Success',
          text: 'Edit Phone Number Success',
          showConfirmButton: false,
          timer: 3000
        })
        closeModal.click();
      }, error => {
        this.loadingBut = false;
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: error.error.message,
          timer: 4000
        })
        closeModal.click();
      }
    )
  }

  checkCountChar() {
    let countCharOne = this.charRemove(this.phoneNumberOne);
    let countCharTwo = this.charRemove(this.phoneNumberTwo);
    
    if(countCharOne) {
      this.flagCountOne = countCharOne.length > 8 ? true : false;
    }
    if(countCharTwo) {
      this.flagCountTwo = countCharTwo.length > 8 ? true : false;
    }
  }

  async getPatientHopeId(val) {
    let body = await this.patientService.getPatientHopeDetail(val.patientId)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: err.error.message,
          timer: 4000
        })
        return null;
      });

    return body
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
    this.modalService.open(modal, { windowClass: 'fo_modal_admission_2', size: 'lg' });
  }

  getSearchedPatient1() {
    this.searchPatient = true;
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
    this.searchPatient = false;
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
    if(this.selectPatient === null) {
      this.selectPatient = val;
    } else {
      if(this.selectPatient.patientOrganizationId === val.patientOrganizationId) {
        this.selectPatient = null;
      } else {
        this.selectPatient = val;
      }
    }
  }

  openModalCreate(content) {
    this.open(content);
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openLarge(modal: any) {
    this.modalService.open(modal, { windowClass: 'fo_modal_admission' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  charRemove(str: any) {
    if (str) {
      str = str.replace('(+62)', '0');
      str = str.replace(/_/g, '');
      str = str.replace(/ /g, '');
      str = str.replace(/ /g, '');
      str = str.substr(0, 2) == '00' ? str.substr(1) : str;
    }
    return str;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}

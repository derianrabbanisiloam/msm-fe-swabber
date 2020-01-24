import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AlertService } from '../../../services/alert.service';
import { PatientService } from '../../../services/patient.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import { Doctor } from '../../../models/doctors/doctor';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { ModalAppointmentBpjsComponent } from '../modal-appointment-bpjs/modal-appointment-bpjs.component';
import { RescheduleAppointment } from '../../../models/appointments/reschedule-appointment';
import { environment } from '../../../../environments/environment';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { sourceApps } from '../../../variables/common.variable';

@Component({
  selector: 'app-widget-appointment-bpjs',
  templateUrl: './widget-appointment-bpjs.component.html',
  styleUrls: ['./widget-appointment-bpjs.component.css']
})
export class WidgetAppointmentBpjsComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital: any = this.key.hospital;
  public doctors: Doctor[];
  public rescheduledAppointments: any;
  public totalAppointments: number;
  public todayDateISO: any = moment().format('YYYY-MM-DD');
  public pageSelected: number;
  public myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd/mm/yyyy',
    height: '30px'
  };
  public datePickerModel: any = {};
  public hospitalFormModel: any;
  public keywordsModel: KeywordsModel = new KeywordsModel;
  public maskBirth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public alerts: Alert[] = [];
  public isCanPrevPage: boolean = false;
  public isCanNextPage: boolean = false;
  public checkAll: boolean = false;
  public searchLoader: boolean = false;
  public searchPatientModel: any;
  public patientHope: any;
  public closeResult: string;
  public patientSelected: any;
  public appointmentSelected: any;
  public user = this.key.user;
  private userId: string = this.user.id;
  private source: string = sourceApps;
  public isSuccessCreateContact: boolean = false;
  public contactId: string;
  public createContactMsg: string;
  public tampung: any = [];
  public patientDetail: any;

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private activeModal: NgbActiveModal,
  ) {
    this.tampung = [
    {
      "patient_name": "agus",
      "appointment_bpjs_id": 1,
      "appointment_id": "5473e034-f8fe-43a3-b257-48f6de16c16a",
      "hospital_id": "39764039-37b9-4176-a025-ef7b2e124ba4",
      "hospital_alias": "SHLV",
      "bpjs_card_number": "ab129Er",
      "identity_type_id": "",
      "identity_number": "79872347",
      "medical_record_number": 7612548,
      "contact_id": "8f7a6a61-bcd6-4a42-bca7-60c6db1e6b15",
      "phone_number_1": "082297175638",
      "appointment_date": "2020-01-23",
      "poly_code": "gen",
      "reference_no": "jb93jv",
      "reference_type": "",
      "booking_code": "AB3LP1",
      "is_notified": false,
      "checked": false,
      "birth_date": "19-08-1998",
    },
    {
      "patient_name": "agus",
      "appointment_bpjs_id": 2,
      "appointment_id": "e538cf36-957e-4eba-9bb6-4b6f1425a549",
      "hospital_id": "39764039-37b9-4176-a025-ef7b2e124ba4",
      "hospital_alias": "SHLV",
      "bpjs_card_number": "ab123tq",
      "identity_type_id": "",
      "identity_number": "798748748",
      "medical_record_number": 44656,
      "contact_id": "452f244f-85e6-4ea0-9f2c-93826eaf2ffd",
      "phone_number_1": "082297175637",
      "appointment_date": "2020-01-23",
      "poly_code": "gen",
      "reference_no": "p93jrj",
      "reference_type": "",
      "booking_code": "AB3LP2",
      "is_notified": false,
      "checked": false,
      "birth_date": "11-08-2003"
    },
  ]
   }

  ngOnInit() {
     //this.getHospitals();
     this.keywordsModel.hospitalId = this.hospital.id;
     this.getDoctors(this.hospital.id);
     this.initializeDateRangePicker();
     this.getCollectionAlert();
     this.emitUpdateContact();
     this.emitRescheduleApp();
     this.getRescheduleWorklist();
  }
  
  CheckAllOptions() {
    if (this.rescheduledAppointments.every(val => val.checked == true))
      this.rescheduledAppointments.forEach(val => { val.checked = false });
    else
      this.rescheduledAppointments.forEach(val => { val.checked = true });
  }

  getDoctors(hospitalId: string) {
    this.doctorService.getListDoctor(hospitalId)
      .subscribe(data => {
        this.doctors = data.data;
      }, err => {
        this.doctors = [];
      }
      );
  }

  initializeDateRangePicker() {
    const m = moment();
    const year = Number(m.format('YYYY'));
    const month = Number(m.format('MM'));
    const date = Number(m.format('DD'));
    this.datePickerModel = {
      beginDate: { year: year, month: month, day: date },
      endDate: { year: year, month: month, day: date },
    };
    this.keywordsModel.fromDate = m.format('YYYY-MM-DD');
    this.keywordsModel.toDate = this.keywordsModel.fromDate;
  }

  changeDateRange(dateRange: any) {
    if (dateRange) {
      let bYear = dateRange.beginDate.year;
      let bMonth = dateRange.beginDate.month;
      bMonth = Number(bMonth) < 10 ? '0' + bMonth : bMonth;
      let bDay = dateRange.beginDate.day;
      bDay = Number(bDay) < 10 ? '0' + bDay : bDay;
      let eYear = dateRange.endDate.year;
      let eMonth = dateRange.endDate.month;
      eMonth = Number(eMonth) < 10 ? '0' + eMonth : eMonth;
      let eDay = dateRange.endDate.day;
      eDay = Number(eDay) < 10 ? '0' + eDay : eDay;
      this.keywordsModel.fromDate = bYear + '-' + bMonth + '-' + bDay;
      this.keywordsModel.toDate = eYear + '-' + eMonth + '-' + eDay;
      this.getRescheduleWorklist();
    }
  }

  getRescheduleWorklist(doctor?: any) {
    if (doctor) {
      this.keywordsModel.doctorId = doctor.doctor_id;
    }
    const {
      hospitalId = '', fromDate = this.todayDateISO, toDate = this.todayDateISO,
      patientName = '', doctorId = '', offset = 0, limit = 10
    } = this.keywordsModel;
    this.appointmentService.getRescheduleWorklist(
      hospitalId,
      fromDate,
      toDate,
      patientName,
      doctorId,
      offset,
      limit
    ).subscribe(
      data => {
        this.rescheduledAppointments = this.tampung;
        // this.rescheduledAppointments = data.data;
        // this.rescheduledAppointments.map(x => {
        //   x.birth_date = moment(x.birth_date).format('DD-MM-YYYY');
        //   x.appointment_date = moment(x.appointment_date).format('DD-MM-YYYY');
        //   x.appointment_from_time = x.appointment_from_time.substr(0, 5);
        //   x.appointment_to_time = x.appointment_to_time.substr(0, 5);
        //   x.checked = false;
        // });
        // this.isCanNextPage = this.rescheduledAppointments.length >= 10 ? true : false;
      }
      
    );
  }

  openConfirmationModal(modal) {
    this.open(modal);
  }

  emitUpdateContact() {
    this.patientService.updateContactSource$.subscribe(
      async (result) => {
        if (result) {
          this.alertService.success('Ubah nomor HP berhasil', false, 5000);
          await this.getRescheduleWorklist();
        } else {
          this.alertService.error('Gagal ubah nomor HP', false, 5000);
        }
      }
    );
  }

  
  setVerifyPatient(patient: any) {
    this.patientSelected = patient; 
  }

  async openModal(data, content) {
    this.appointmentSelected = data;
    console.log('this.appointment', this.appointmentSelected)
    //await this.getPatientDetail();
    await this.searchPatient();
    this.open(content);
  }

  // async getPatientDetail() {
  //   this.patientDetail = await this.appointmentService.getRoomHope(organizationId)
  //     .toPromise().then(res => {
  //       return res.data;
  //     }).catch(err => {
  //       return [];
  //     })
  //   return this.patientDetail;
  // }

  openAppBpjsModal() {
    let body;
    if(this.patientSelected) {
      body = {
        patientHopeId : this.patientSelected.patientId,
        name: this.patientSelected.name,
        birthDate: this.patientSelected.birthDate,
        phoneNumber1: this.patientSelected.mobileNo1,
        addressLine1: this.patientSelected.address
      };
      const modalRef = this.modalService.open(ModalAppointmentBpjsComponent,  
        {windowClass: 'cc_modal_confirmation', size: 'lg'});
      modalRef.componentInstance.appointmentSelected = body;
    } else {
      body = {
        patientHopeId : null,
        name: this.appointmentSelected.patient_name,
        birthDate: this.appointmentSelected.birth_date,
        phoneNumber1: this.appointmentSelected.phone_number_1,
        addressLine1: ''
      };
      const modalRef = this.modalService.open(ModalAppointmentBpjsComponent,  
        {windowClass: 'cc_modal_confirmation', size: 'lg'});
      modalRef.componentInstance.appointmentSelected = body;
    }
    
  }

  createContact() {
    const app = this.appointmentSelected;
    const payload = {
      name: app.contact_name,
      birthDate: app.date_of_birth,
      phoneNumber1: app.phone_number,
      channelId: app.channel_id,
      emailAddress: app.email_address,
      cityId: app.city_id,
      countryId: app.country_id,
      districtId: app.district_id,
      subDistrictId: app.sub_district_id,
      currentAddress: app.address,
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

  searchPatient() {
    this.searchLoader = true;
    this.searchPatientModel = null;
    if (!this.searchPatientModel) {
      this.searchPatientModel = {
        patientName: this.appointmentSelected.patient_name,
        patientBirth: this.appointmentSelected.birth_date,
        hospitalId: this.appointmentSelected.hospital_id,
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


  emitRescheduleApp() {
    this.appointmentService.rescheduleAppSource$.subscribe(
      result => {
        if (result === true) {
          this.alertService.success('Reschedule appointment berhasil', false, 5000);
          this.getRescheduleWorklist();
        } else {
          this.alertService.error(result, false, 5000);
        }
      }
    );
  }

  private page: number = 0;
  nextPage() {
    this.page += 1;
    this.keywordsModel.offset = this.page * 10;
    this.isCanPrevPage = this.keywordsModel.offset === 0 ? false : true;
    this.getRescheduleWorklist();
  }
  prevPage() {
    this.page -= 1;
    this.keywordsModel.offset = this.page * 10;
    this.isCanPrevPage = this.keywordsModel.offset === 0 ? false : true;
    this.getRescheduleWorklist();
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

  close() {
    this.activeModal.close();
  }

  open(content) {
    this.modalService.open(content, { windowClass: 'fo_modal_search'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

class KeywordsModel {
  hospitalId: string;
  fromDate: string;
  toDate: string;
  patientName: string;
  localMrNo: string;
  birthDate: string;
  doctorId: string;
  offset: number;
  limit: number;
}

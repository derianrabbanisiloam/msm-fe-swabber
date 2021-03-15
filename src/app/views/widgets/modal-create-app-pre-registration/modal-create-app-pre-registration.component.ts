import * as moment from 'moment';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
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
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-modal-create-app-pre-registration',
  templateUrl: './modal-create-app-pre-registration.component.html',
  styleUrls: ['./modal-create-app-pre-registration.component.css']
})
export class ModalCreateAppPreRegistrationComponent implements OnInit {

  @Input() appPreRegisSelected: any;
  @Input() orderDetailSelected: any;
  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public searchPatientModel: any;
  public maskBirth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public patientHope: PatientHope[];
  public searchLoader: boolean = false;
  public patientSelected: any = null;
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
  public flagDis: boolean = false;
  public catTestList: any;
  public orderDetail: any;
  public searchKeywords: any = {
    checkup: {}
  };

  constructor(
    private router: Router,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private alertService: AlertService,
    private doctorService: DoctorService,
    private scheduleService: ScheduleService
  ) { }

  async ngOnInit() {
    this.searchPatient();
    this.getCollectionAlert();
  }

  searchPatient() {
    this.searchLoader = true;
    this.patientSelected = null;
    if (!this.searchPatientModel) {
      this.searchPatientModel = {
        patientName: this.appPreRegisSelected.name,
        patientBirth: this.appPreRegisSelected.new_birth_date,
        hospitalId: this.hospital.id,
      };
    }
    const hospitalId = this.searchPatientModel.hospitalId;
    const patientName = this.searchPatientModel.patientName;
    const dob = this.searchPatientModel.patientBirth.split('-');
    const birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];

    this.patientService.searchPatientHope1(hospitalId, patientName, birthDate).subscribe(
      data => {
        if(data.data.length > 0) {
          this.searchLoader = false;
          this.patientHope = data.data;
        } else {
          this.searchLoader = false;
          this.patientHope = null;
        }
        
      }
    )
  }

  createApp() {
    this.flagDis = true;
    this.orderDetail = this.orderDetailSelected;
    // const idx = this.catTestList.findIndex((i) => {
    //   return i.checkup_id === this.orderDetail.hope_salesitem_category_id;
    // })

    this.appPreRegisSelected.current_address = this.patientSelected.address;
    this.appPreRegisSelected.patient_name = this.patientSelected.name;
    this.appPreRegisSelected.birth_date = this.patientSelected.birthDate;
    this.appPreRegisSelected.patient_hope_id = this.patientSelected.patientId;
    this.appPreRegisSelected.phone_number_1 = this.patientSelected.mobileNo1 ? this.patientSelected.mobileNo1.trim() : '';
    this.appPreRegisSelected.mr_local = this.patientSelected.mrNoUnit;

    this.searchKeywords = {
      fromPreRegis: true,
      patientPreReg: this.appPreRegisSelected,
      orderDetail: this.orderDetail,
    };

    let searchKey = {
      type: 'params',
      fromPreRegis: true
    };

    this.doctorService.searchDoctorSource2 = this.searchKeywords;
    this.router.navigate(['/base-appointment'], { queryParams: searchKey });
    localStorage.setItem('searchKey', JSON.stringify(searchKey));
    setTimeout(() => { 
      this.close(); 
      this.flagDis = false;
      this.appointmentService.emitCloseModal(true);
    }, 1000);
  }

  createPatient() {
    this.flagDis = true;
    this.orderDetail = this.orderDetailSelected;

    this.searchKeywords = {
      fromPreRegis: true,
      fromPatientData: true,
      patientPreReg: this.appPreRegisSelected,
      orderDetail: this.orderDetail
    };

    let searchKey = {
      type: 'params',
    };

    let params = {
      fromPreRegis: true,
      fromPatientData: true
    }

    localStorage.setItem('fromPreRegis', JSON.stringify(this.searchKeywords));
    localStorage.setItem('searchKey', JSON.stringify(searchKey));
    this.router.navigate(['/patient-data'], { queryParams: params });
    setTimeout(() => { 
      this.close(); 
      this.flagDis = false;
      this.appointmentService.emitCloseModal(true);
    }, 1000);
  }

  setVerifyPatient(patient: any) {
    if(this.patientSelected === null) {
      this.patientSelected = patient;
    } else {
      if(this.patientSelected.patientId === patient.patientId 
        && this.patientSelected.patientOrganizationId === patient.patientOrganizationId) {
          this.patientSelected = null;
        }
      else {
        this.patientSelected = patient;
      }
    }
    
  }

  openConfirmationModal(modal: any) {
    this.modalService.open(modal);
  }

  createContact() {
    const app = this.appPreRegisSelected;
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
    const app = this.appPreRegisSelected;
    const payload: patientPayload = {
      patientHopeId: this.patientSelected.patientId,
      contactId: app.contact_id ? app.contact_id : null,
      hospitalId: app.hospital_id,
      userId: this.userId,
      source: this.source
    };

    const mappingPatient = await this.patientService.verifyPatient(payload).toPromise().then(
      data => {
        this.contactId = data.data.contact_id;
        return data.data;
      }
    );
    return mappingPatient;
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

}

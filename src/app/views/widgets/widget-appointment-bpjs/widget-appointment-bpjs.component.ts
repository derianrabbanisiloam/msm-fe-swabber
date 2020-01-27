import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AlertService } from '../../../services/alert.service';
import { PatientService } from '../../../services/patient.service';
import { BpjsService } from '../../../services/bpjs.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import { Doctor } from '../../../models/doctors/doctor';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { ModalAppointmentBpjsComponent } from '../modal-appointment-bpjs/modal-appointment-bpjs.component';
import { RescheduleAppointment } from '../../../models/appointments/reschedule-appointment';
import { environment } from '../../../../environments/environment';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { sourceApps } from '../../../variables/common.variable';
import { dateFormatter } from '../../../utils/helpers.util';
import { isEmpty } from 'lodash';

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
  public bpjsAppointments: any;
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
  public flagPatientHope: boolean = false;
  public dateConvert: any;

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private bpjsService: BpjsService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private activeModal: NgbModal,
    modalSetting: NgbModalConfig,
  ) {
    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
   }

  ngOnInit() {
     this.keywordsModel.hospitalId = this.hospital.id;
     this.getDoctors(this.hospital.id);
     this.initializeDateRangePicker();
     this.getCollectionAlert();
     this.getAppointmentBpjs();
     this.emitCreateApp();
  }

  emitCreateApp() {
    this.appointmentService.createAppSource$.subscribe(
      async () => {
        this.activeModal.dismissAll();
        this.getAppointmentBpjs();
      }
    );
  }
  
  CheckAllOptions() {
    if (this.bpjsAppointments.every(val => val.checked == false 
      && val.is_notified == false && val.appointment_id)) {
        this.bpjsAppointments.forEach(val => { val.checked = true });
      }
    else {
      this.bpjsAppointments.forEach(val => { val.checked = false });
    }
  }

  checkboxBpjs(content) {
    this.bpjsAppointments.map(x => {
      if(x.checked === true) {
        this.openTwo(content);
      }
    });
  }
  updateBpjs() {
    let body;
    let tampung = [];
    this.bpjsAppointments.map(x => {
      if(x.checked === true) {
        tampung.push(x.appointment_bpjs_id)
      } 
    });

    body = {
      appBpjsId: tampung,
      userId: this.user.id,
      userName: this.user.fullname,
      source: sourceApps
    }

    this.bpjsService.notifyBpjs(body)
      .subscribe(data => {
        this.getAppointmentBpjs();
        this.alertService.success('Success update to BPJS', false, 3000);
      }, err => {
        this.alertService.error(err.error.message);
      }
    );
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
      this.getAppointmentBpjs();
    }
  }

  getAppointmentBpjs(doctor?: any) {
    if (doctor) {
      this.keywordsModel.doctorId = doctor.doctor_id;
    }
    const {
      hospitalId = '', fromDate = this.todayDateISO, toDate = this.todayDateISO,
      patientName = '', doctorId = '', offset = 0, limit = 10
    } = this.keywordsModel;
    this.bpjsService.getListAppointmentBpjs(
      hospitalId,
      fromDate,
      toDate,
      patientName,
      doctorId,
      offset,
      limit
    ).subscribe(
      data => {
        //this.bpjsAppointments = this.tampung;
        this.bpjsAppointments = data.data;
        this.bpjsAppointments.map(x => {
          if(x.appointment_id && x.is_notified === false) {
            x.hideChecked = false;
          } else {
            x.hideChecked = true;
          }
          x.appointment_date = moment(x.appointment_date).format('DD-MM-YYYY');
        });
        this.isCanNextPage = this.bpjsAppointments.length >= 10 ? true : false;
      }
      
    );
  }

  openConfirmationModal(modal) {
    this.open(modal);
  }
  
  setVerifyPatient(patient: any) {
    this.patientSelected = patient;
  }

  async getAppBpjsDetail(appBpjsId) {
    this.patientDetail = await this.bpjsService.getAppointmentDetailById(appBpjsId)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        this.alertService.error(err.message);
        return [];
      });

      this.dateConvert = dateFormatter(this.patientDetail.appointment_date, true);
  }
  
  async openModal(data, content) {
    this.patientSelected = null;
    this.appointmentSelected = data;
    await this.getAppBpjsDetail(this.appointmentSelected.appointment_bpjs_id);
    await this.searchPatient();
    this.open(content);
  }

  searchPatient() {
    this.searchLoader = true;
    this.searchPatientModel = null;
    if (!this.searchPatientModel) {
      this.searchPatientModel = {
        patientName: this.patientDetail.name,
        patientBirth: dateFormatter(this.patientDetail.dob, true),
        hospitalId: this.appointmentSelected.hospital_id,
      }; 
    }
    const hospitalId = this.searchPatientModel.hospitalId;
    const patientName = this.searchPatientModel.patientName;
    const dob = this.searchPatientModel.patientBirth.split('-');
    const birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];
    this.patientService.searchPatientHope1(hospitalId, patientName, birthDate).subscribe(
      data => {
        if(!isEmpty(data.data)) {
          this.searchLoader = false;
          this.patientHope = data.data;
        } else {
          this.searchLoader = false;
          this.patientHope = null;
        }
      }
    )
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
        addressLine1: this.patientSelected.address,
        speciality: this.patientDetail.speciality_name_en,
        appointmentDate: this.patientDetail.appointment_date,
        appBpjsId: this.appointmentSelected.appointment_bpjs_id
      };
      const modalRef = this.modalService.open(ModalAppointmentBpjsComponent,  
        {windowClass: 'cc_modal_confirmation', size: 'lg'});
      modalRef.componentInstance.appointmentSelected = body;
    } else {
      body = {
        patientHopeId : null,
        name: this.patientDetail.name,
        birthDate: this.patientDetail.dob,
        phoneNumber1: this.patientDetail.phone_number_1,
        addressLine1: '',
        speciality: this.patientDetail.speciality_name_en,
        appointmentDate: this.patientDetail.appointment_date,
        appBpjsId: this.appointmentSelected.appointment_bpjs_id
      };
      const modalRef = this.modalService.open(ModalAppointmentBpjsComponent,  
        {windowClass: 'cc_modal_confirmation', size: 'lg'});
      modalRef.componentInstance.appointmentSelected = body;
    }
  }

  private page: number = 0;
  nextPage() {
    this.page += 1;
    this.keywordsModel.offset = this.page * 10;
    this.isCanPrevPage = this.keywordsModel.offset === 0 ? false : true;
    this.getAppointmentBpjs();
  }
  prevPage() {
    this.page -= 1;
    this.keywordsModel.offset = this.page * 10;
    this.isCanPrevPage = this.keywordsModel.offset === 0 ? false : true;
    this.getAppointmentBpjs();
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

  open(content) {
    this.modalService.open(content, { windowClass: 'fo_modal_search'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openTwo(content) {
    this.modalService.open(content).result.then((result) => {
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

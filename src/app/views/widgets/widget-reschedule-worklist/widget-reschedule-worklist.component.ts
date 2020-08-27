import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AlertService } from '../../../services/alert.service';
import { PatientService } from '../../../services/patient.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Doctor } from '../../../models/doctors/doctor';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { ModalRescheduleAppointmentComponent } from '../modal-reschedule-appointment/modal-reschedule-appointment.component';
import { RescheduleAppointment } from '../../../models/appointments/reschedule-appointment';
import { environment } from '../../../../environments/environment';
import { sourceApps, channelId, appointmentStatusId, paymentStatus,
  SecretKey, Jwt, APP_RESCHEDULE, keySocket } from '../../../variables/common.variable';
import {
  ModalAppointmentBpjsComponent
} from '../modal-appointment-bpjs/modal-appointment-bpjs.component';
import socket from 'socket.io-client';
import Security from 'msm-kadapat';

@Component({
  selector: 'app-widget-reschedule-worklist',
  templateUrl: './widget-reschedule-worklist.component.html',
  styleUrls: ['./widget-reschedule-worklist.component.css']
})
export class WidgetRescheduleWorklistComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital: any = this.key.hospital;
  public doctors: Doctor[];
  public rescheduledAppointments: RescheduleAppointment[];
  public rescheduledAppointmentsBpjs: RescheduleAppointment[];
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
  public keywordsBpjs: KeywordsBpjs = new KeywordsModel;
  public maskBirth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public alerts: Alert[] = [];
  public isCanPrevPage: boolean = false;
  public isCanNextPage: boolean = false;
  public isCanPrevPageBpjs: boolean = false;
  public isCanNextPageBpjs: boolean = false;
  public isWorklist: boolean = true;
  public isAido: boolean = false;
  public isBpjs: boolean = false;
  public countAppRes: number;
  public countAppResBpjs: number;
  private socket;
  //aido
  public count: number = -1;
  public countAppResAido: number;
  public aidoAppointments: any [];
  public showWaitMsg: boolean = false;
  public showNotFoundMsg: boolean = false;
  public keywordsModelTwo: KeywordsModelTwo = new KeywordsModelTwo;
  public bodyKeyword: any = { valueOne: null, valueTwo: null, valueThree: null, valueFour: null,
    valueFive: null, valueSix: null, valueSeven: null, valueEight: null };
  public bodyKeywordTwo: any = { valueOne: null, valueTwo: null, valueThree: null, valueFour: null,
    valueFive: null, valueSix: null, valueSeven: null, valueEight: null };
  public appStatusId = appointmentStatusId;
  public payStatus: any = paymentStatus;
  public arrChannel: any = channelId;
  public isCanPrevPageTwo: boolean = false;
  public isCanNextPageTwo: boolean = false;

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private modalService: NgbModal,
    private alertService: AlertService,
  ) {
    this.socket = socket(`${environment.WEB_SOCKET_SERVICE + keySocket.APPOINTMENT}`, {
      transports: ['websocket'],
      query: `data=${
        Security.encrypt({ secretKey: SecretKey }, Jwt)
        }&url=${environment.CALL_CENTER_SERVICE}`,
    });
   }

  ngOnInit() {
    this.keywordsModel.hospitalId = this.hospital.id;
    this.keywordsModelTwo.hospitalId = this.hospital.id;
    this.keywordsBpjs.hospitalId = this.hospital.id;
    this.socket.on(APP_RESCHEDULE+'/'+this.hospital.id, (call) => {
      this.countAppRes = call.data;
    });
    this.getDoctors(this.hospital.id);
    this.initializeDateRangePicker();
    this.getCollectionAlert();
    this.emitUpdateContact();
    this.emitRescheduleApp();
    this.getRescheduleWorklist();
    this.getAidoWorklist();
    this.getRescheduleWorklistBpjs();
    this.countRecheduleNonBpjs();
    this.countRecheduleBpjs();
    this.countRecheduleAido();
  }

  countRecheduleNonBpjs() {
    this.appointmentService.getCountAppReschedule(this.hospital.id, channelId.BPJS, true).subscribe(
      data => {
        this.countAppRes = data.data;
      }
    );
  }

  countRecheduleBpjs() {
    this.appointmentService.getCountAppReschedule(this.hospital.id, channelId.BPJS, false).subscribe(
      data => {
        this.countAppResBpjs = data.data;
      }
    );
  }

  countRecheduleAido() {
    this.appointmentService.getCountAppRescheduleAido(this.hospital.id).subscribe(
      data => {
        this.countAppResAido = data.data;
      }
    );
  }

  rescheduleWorklistButton(active) {
    if(active === 'aido') {this.isAido = true; this.isWorklist = false; this.isBpjs = false;}
    else if(active === 'worklist') {this.isWorklist = true; this.isAido = false; this.isBpjs = false;}
    else if(active === 'bpjs') {this.isBpjs = true; this.isAido = false; this.isWorklist = false;}
  }

  async getAidoWorklist() {
    this.count+=1;
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    let offsetTemp;
    const {
      hospitalId = '', fromDate = this.todayDateISO, toDate = this.todayDateISO,
      patientName = '', doctorId, isDoubleMr = null, admStatus = '', payStatus = '', offset = 0, limit = 10
    } = await this.keywordsModelTwo;
    offsetTemp = offset;
    
    if(this.count === 0) {
      this.bodyKeyword.valueOne = hospitalId, this.bodyKeyword.valueTwo = fromDate, this.bodyKeyword.valueThree = toDate;
      this.bodyKeyword.valueFour = patientName, this.bodyKeyword.valueFive = doctorId ? doctorId.doctor_id : '';
      this.bodyKeyword.valueSix = isDoubleMr, this.bodyKeyword.valueSeven = admStatus, this.bodyKeyword.valueEight = payStatus;

      this.bodyKeywordTwo.valueOne = hospitalId, this.bodyKeywordTwo.valueTwo = fromDate, this.bodyKeywordTwo.valueThree = toDate;
      this.bodyKeywordTwo.valueFour = patientName, this.bodyKeywordTwo.valueFive = doctorId ? doctorId.doctor_id : '';
      this.bodyKeywordTwo.valueSix = isDoubleMr, this.bodyKeywordTwo.valueSeven = admStatus, this.bodyKeywordTwo.valueEight = payStatus;
    } else if(this.count > 0) {
      this.bodyKeyword.valueOne = hospitalId, this.bodyKeyword.valueTwo = fromDate, this.bodyKeyword.valueThree = toDate;
      this.bodyKeyword.valueFour = patientName, this.bodyKeyword.valueFive = doctorId ? doctorId.doctor_id : '';
      this.bodyKeyword.valueSix = isDoubleMr, this.bodyKeyword.valueSeven = admStatus, this.bodyKeyword.valueEight = payStatus;

      if(this.bodyKeyword.valueOne !== this.bodyKeywordTwo.valueOne || this.bodyKeyword.valueTwo !== this.bodyKeywordTwo.valueTwo ||
        this.bodyKeyword.valueThree !== this.bodyKeywordTwo.valueThree || this.bodyKeyword.valueFour !== this.bodyKeywordTwo.valueFour ||
        this.bodyKeyword.valueFive !== this.bodyKeywordTwo.valueFive || this.bodyKeyword.valueSix !== this.bodyKeywordTwo.valueSix ||
        this.bodyKeyword.valueSeven !== this.bodyKeywordTwo.valueSeven || this.bodyKeyword.valueEight !== this.bodyKeywordTwo.valueEight) {    
          this.bodyKeywordTwo.valueOne = hospitalId, this.bodyKeywordTwo.valueTwo = fromDate, this.bodyKeywordTwo.valueThree = toDate;
          this.bodyKeywordTwo.valueFour = patientName, this.bodyKeywordTwo.valueFive = doctorId ? doctorId.doctor_id : '';
          this.bodyKeywordTwo.valueSix = isDoubleMr, this.bodyKeywordTwo.valueSeven = admStatus, this.bodyKeywordTwo.valueEight = payStatus;
        
          this.page = 0;
          offsetTemp = 0;
          this.keywordsModel.offset = offsetTemp;
          this.isCanPrevPageTwo = offsetTemp === 0 ? false : true;
      }
    }

    let doctorSearch = doctorId ? doctorId.doctor_id : '';
    this.appointmentService.getRescheduleWorklistAido(
      hospitalId,
      fromDate,
      toDate,
      patientName,
      doctorSearch,
      offsetTemp,
      limit
    ).subscribe(
      data => {
        if (data.data.length !== 0) {
          this.showWaitMsg = false;
          this.showNotFoundMsg = false;
          this.aidoAppointments = data.data;
          this.aidoAppointments.map(x => {
            x.date_of_birth = moment(x.date_of_birth).format('DD-MM-YYYY');
            x.appointment_date = moment(x.appointment_date).format('DD-MM-YYYY');
            x.appointment_from_time = x.appointment_from_time.substr(0, 5);
            x.appointment_to_time = x.appointment_to_time.substr(0, 5);
          });
          this.isCanNextPageTwo = this.aidoAppointments.length >= 10 ? true : false;
        }
        else {
          this.aidoAppointments = null;
          this.showWaitMsg = false;
          this.showNotFoundMsg = true;
          this.isCanNextPageTwo = false;
        }
      }, error => {
       this.showWaitMsg = false;
       this.showNotFoundMsg = true;
       this.alertService.error(error.error.message, false, 3000);
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
      if(this.isAido === true) {
        this.keywordsModelTwo.fromDate = bYear + '-' + bMonth + '-' + bDay;
        this.keywordsModelTwo.toDate = eYear + '-' + eMonth + '-' + eDay;
        this.getAidoWorklist();
      }
      else if(this.isWorklist === true) {
        this.keywordsModel.fromDate = bYear + '-' + bMonth + '-' + bDay;
        this.keywordsModel.toDate = eYear + '-' + eMonth + '-' + eDay;
        this.getRescheduleWorklist();
      }
      else if(this.isBpjs === true) {
        this.keywordsModel.fromDate = bYear + '-' + bMonth + '-' + bDay;
        this.keywordsModel.toDate = eYear + '-' + eMonth + '-' + eDay;
        this.getRescheduleWorklist();
      }
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
      limit,
      channelId.BPJS,
      true
    ).subscribe(
      data => {
        this.rescheduledAppointments = data.data;
        this.rescheduledAppointments.map(x => {
          x.birth_date = moment(x.birth_date).format('DD-MM-YYYY');
          x.appointment_date = moment(x.appointment_date).format('DD-MM-YYYY');
          x.appointment_from_time = x.appointment_from_time.substr(0, 5);
          x.appointment_to_time = x.appointment_to_time.substr(0, 5);
        });
        this.isCanNextPage = this.rescheduledAppointments.length >= 10 ? true : false;
      }
    );
  }

  getRescheduleWorklistBpjs(doctor?: any) {
    if (doctor) {
      this.keywordsBpjs.doctorId = doctor.doctor_id;
    }
    const {
      hospitalId = '', fromDate = this.todayDateISO, toDate = this.todayDateISO,
      patientName = '', doctorId = '', offset = 0, limit = 10
    } = this.keywordsBpjs;
    this.appointmentService.getRescheduleWorklist(
      hospitalId,
      fromDate,
      toDate,
      patientName,
      doctorId,
      offset,
      limit,
      channelId.BPJS,
      false
    ).subscribe(
      data => {
        this.rescheduledAppointmentsBpjs = data.data;
        this.rescheduledAppointmentsBpjs.map(x => {
          x.birth_date = moment(x.birth_date).format('DD-MM-YYYY');
          x.appointment_date = moment(x.appointment_date).format('DD-MM-YYYY');
          x.appointment_from_time = x.appointment_from_time.substr(0, 5);
          x.appointment_to_time = x.appointment_to_time.substr(0, 5);
        });
        this.isCanNextPageBpjs = this.rescheduledAppointmentsBpjs.length >= 10 ? true : false;
      }
    );
  }

  openRescheduleModal(appointmentSelected: any) {
    const modalRef = this.modalService.open(ModalRescheduleAppointmentComponent,
      { windowClass: 'cc_modal_confirmation', size: 'lg' });
    modalRef.componentInstance.appointmentSelected = appointmentSelected;
  }

  openRescheduleBpjsModal(appointmentSelected: any) {
    const modalRef = this.modalService.open( ModalAppointmentBpjsComponent,
      { windowClass: 'cc_modal_confirmation', size: 'lg' });
    modalRef.componentInstance.appointmentSelected = appointmentSelected;
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

  nextPageBpjs() {
    this.page += 1;
    this.keywordsBpjs.offset = this.page * 10;
    this.isCanPrevPageBpjs = this.keywordsBpjs.offset === 0 ? false : true;
    this.getRescheduleWorklistBpjs();
  }
  prevPageBpjs() {
    this.page -= 1;
    this.keywordsBpjs.offset = this.page * 10;
    this.isCanPrevPageBpjs = this.keywordsBpjs.offset === 0 ? false : true;
    this.getRescheduleWorklistBpjs();
  }

  nextPageAido() {
    this.page += 1;
    this.keywordsModelTwo.offset = this.page * 10;
    this.isCanPrevPageTwo = this.keywordsModelTwo.offset === 0 ? false : true;
    this.getAidoWorklist();
  }
  prevPageAido() {
    this.page -= 1;
    this.keywordsModelTwo.offset = this.page * 10;
    this.isCanPrevPageTwo = this.keywordsModelTwo.offset === 0 ? false : true;
    this.getAidoWorklist();
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

class KeywordsBpjs {
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

class KeywordsModelTwo {
  hospitalId: string;
  fromDate: string;
  toDate: string;
  patientName: string;
  localMrNo: string;
  birthDate: string;
  doctorId: any;
  isDoubleMr: boolean;
  admStatus: string;
  payStatus: string;
  offset: number;
  limit: number;
}

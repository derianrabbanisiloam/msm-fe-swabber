import { Component, OnInit } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
// import { IMyDpOptions } from 'mydaterangepicker';
import { NgbModal, ModalDismissReasons, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../services/appointment.service';
import { CheckupService } from '../../../services/checkup.service';

import { Appointment } from '../../../models/appointments/appointment';
import { dateFormatter, regionTime, printPreview } from '../../../utils/helpers.util';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { sourceApps, queueType, appointmentStatusId, channelId } from '../../../variables/common.variable';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { WebsocketService } from '../../../services/websocket.service';
import { checkupResultPayload } from 'src/app/payloads/checkup-result.payload';
import { IMyDrpOptions } from 'mydaterangepicker';

@Component({
  selector: 'app-widget-swab-list',
  templateUrl: './widget-swab-list.component.html',
  styleUrls: ['./widget-swab-list.component.css']
})
export class WidgetSwabListComponent implements OnInit {

  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key') || "{}");
  public hospital = this.key.hospital;
  public isBridging = this.key.hospital.isBridging
  public user = this.key.user;
  public now = new Date();
  public appStatusId = appointmentStatusId;
  public qType = queueType;
  public isSubmitting: boolean = false;
  public userId: string = this.user.id;
  private userName: string = this.user.fullname;
  public addCheckupResultPayload: checkupResultPayload;

  public dateAppointment: any = {
    date: {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate(),
    }
  };

  public summarySwab:any = {
    total: 0,
    done: 0,
    undone: 0
  }

  public dateAdmission: any = {
    beginDate: {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate(),
    },
    endDate: {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate(),
    }
  };

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd/mm/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    height: '35px',
    width: '150px',
    showInputField: true,
  };

  public myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd/mm/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    height: '35px',
    width: '240px',
  };

  // Input mask
  public mask_birth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public model: any = { hospital_id: '', name: '', birth:"", mr: '', identityNumber: '', admissionDate: '',
  category: '', modifiedName: '', checkupResult: undefined };

  public categoryList: any[];
  public appList: Appointment[];
  public appListTemp: any;
  public selectedSwab: any;

  public limit = 20;
  public offset = 0;
  private page: number = 0;
  public isCanPrevPage: boolean = false;
  public isCanNextPage: boolean = false;

  public alerts: Alert[] = [];
  public showWaitMsg: boolean = false;
  public showNotFoundMsg: boolean = false;
  public closeResult: string;

  public isError: boolean = false;

  public checkupResult: any;

  constructor(
    private alertService: AlertService,
    private appointmentService: AppointmentService,
    private checkupService: CheckupService,
    private modalService: NgbModal,
    private webSocketService: WebsocketService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  async ngOnInit() {
    await this.getListCategories();
    await this.listAppointment();
    await this.getCollectionAlert();
  }

  nextPage() {
    this.page += 1;
    this.offset = this.page * 20;
    this.isCanPrevPage = this.offset === 0 ? false : true;
    this.searchAppointment(false);
  }

  prevPage() {
    this.page -= 1;
    this.offset = this.page * 20;
    this.isCanPrevPage = this.offset === 0 ? false : true;
    this.searchAppointment(false);
  }

  refreshPage() {
    this.isError = false;
  }

  clearSearch() {
    this.model.name = '';
    this.model.mr = '';
    this.model.birth = '';
    this.model.identityNumber = '';
    this.model.category = '';
    this.model.admissionDate = '';
    this.model.modifiedName = '';
    this.model.checkupResult = undefined;
  }

  async getListCategories() {
    this.categoryList = await this.checkupService.getCategory()
    .toPromise().then(res => {
      if (res.status === 'OK' && res.data.length === 0) {
        this.alertService.success('No List Category in This Hospital', false, 3000);
      }

      return res.data
    }).catch(err => {
      this.alertService.error(err.error.message, false, 3000);
      return [];
    })
  }

  async listAppointment(name = '', birth = '',  mr = '', identityNumber = "", admissionDate = '', category = '', modifiedName = '',
  checkupResult = '') {
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    
    const strBeginDate = this.dateAdmission.beginDate.year + '-' + this.dateAdmission.beginDate.month + '-' + this.dateAdmission.beginDate.day;
    const beginDate = dateFormatter(strBeginDate, false);
    
    const strEndDate = this.dateAdmission.endDate.year + '-' + this.dateAdmission.endDate.month + '-' + this.dateAdmission.endDate.day;
    const endDate = dateFormatter(strEndDate, false);
    
    const hospital = this.hospital.id;

    const limit = this.limit;
    const offset = this.offset;
    this.appList = await this.appointmentService.getListAppointmentSwab(beginDate, endDate, hospital, name, birth, mr, identityNumber, admissionDate, category, modifiedName, checkupResult, limit, offset, channelId.BPJS, true)
      .toPromise().then(res => {
        
        if (res.status === 'OK') {

          if (res.data.length > 0) {

            console.log("res.data : ", res.data)

            this.isCanNextPage = res.data.length >= 20 ? true : false;

            for (let i = 0, { length } = res.data; i < length; i += 1) {
              res.data[i].custome_birth_date = dateFormatter(res.data[i].birth_date, true);
              res.data[i].custome_appointment_date = dateFormatter(res.data[i].appointment_date, true);
              res.data[i].custome_admission_date = (res.data[i].admission_date === null) ? "" : dateFormatter(res.data[i].admission_date, true);
              res.data[i].custome_from_time = res.data[i].from_time.substring(0, 5);
              res.data[i].custome_to_time = res.data[i].to_time.substring(0, 5);
            }

            this.summarySwab.total = res.data.length
            this.summarySwab.done = res.data.filter((val:any) => val.checkup_result !== null).length
            this.summarySwab.undone = res.data.filter((val:any) => val.checkup_result === null).length            

            this.showWaitMsg = false;
            this.showNotFoundMsg = false;  
          }          
          else {
            this.showWaitMsg = false;
            this.showNotFoundMsg = true;
          }
        } else {
          this.showWaitMsg = false;
          this.showNotFoundMsg = true;
        }
        return res.data;
      }).catch(err => {
        this.showWaitMsg = false;
        this.showNotFoundMsg = true;
        this.alertService.error(err.error.message, false, 3000);
        return [];
      });
  }

  async searchAppointment(search?: boolean) {
    this.offset = search ? 0 : this.offset;
    let { name, birth, mr, identityNumber, admissionDate, category,  modifiedName, checkupResult } = await this.model;

    const categoryId = category ? category.checkup_id : '';
    const arrBirth = birth ? birth.split('-') : '';
    const arrAdmissionDate = admissionDate ? admissionDate.split('-') : '';
    
    name = name ? name.toLowerCase() : '';
    mr = mr ? mr.toLowerCase() : '';
    modifiedName = modifiedName ? modifiedName.toLowerCase() : '';
    birth = arrBirth ? arrBirth[2] + '-' + arrBirth[1] + '-' + arrBirth[0] : '';
    admissionDate = arrAdmissionDate ? arrAdmissionDate[2] + '-' + arrAdmissionDate[1] + '-' + arrAdmissionDate[0] : '';

    if (name || birth || mr || identityNumber || admissionDate || category || modifiedName || checkupResult) {
      this.listAppointment(name, birth, mr, identityNumber, admissionDate, categoryId, modifiedName, checkupResult);
    } else {
      this.listAppointment();
    }
  }

  onDateChange(val:any) {
    
    const { year, month, day } = val.date;

    if (year === 0 && month === 0 && day === 0) {
      this.clearSearch();
      this.refreshPage();
      this.appList = [];
      this.alertService.error('Please Input Date', false, 3000);
    } else {
      this.dateAppointment = {
        date: {
          year: year,
          month: month,
          day: day,
        }
      };
      this.offset = 0;
      this.clearSearch();
      this.refreshPage();
      this.searchAppointment(false);
    }
  }

  onDateChangeRange(val:any) {

    if ((val.beginDate.year === 0 && val.beginDate.month === 0 && val.beginDate.day === 0) && (val.endDate.year === 0 && val.endDate.month === 0 && val.endDate.day === 0)) {
      this.clearSearch();
      this.refreshPage();
      this.appList = [];
      this.alertService.error('Please Input Date', false, 3000);
    } else {
      this.dateAdmission = {
        beginDate: {
          year: val.beginDate.year,
          month: val.beginDate.month,
          day: val.beginDate.day,
        },
        endDate: {
          year: val.endDate.year,
          month: val.endDate.month,
          day: val.endDate.day,
        }
      };
      this.offset = 0;
      this.clearSearch();
      this.refreshPage();
      this.searchAppointment(false);
    }
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

  open(content:any) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openconfirmation(content:any) {
    this.modalService.open(content, { windowClass: 'fo_modal_confirmation' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getMaxDate(){
    let currentDate = new Date();
     let maxDate = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate()
      }
      return maxDate
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

  async openChekupResultModal(val:any, content:any) {
    
    this.selectedSwab = val;    
    this.selectedSwab.custome_birth_date = dateFormatter(this.selectedSwab.birth_date, true);

    this.openconfirmation(content)
  }

  async createCheckupResult(isResend=false) {

    this.selectedSwab.email_address = "derian.rabbani@gmail.com"
    const checkupResult = (isResend) ? this.selectedSwab.checkup_result : this.checkupResult;
    const emailPayload = {
      appointmentId: this.selectedSwab.appointment_id,
      checkupResult: checkupResult,
      emailPatient: this.selectedSwab.email_address,
    }

    const sendEmail = await this.appointmentService.emailCheckupResult(emailPayload).toPromise().then(res => {
      return (res.status === "OK")
    }).catch(err => {
      this.alertService.error('Failed to send email. Please try again', false);
      return false
    })
    
    this.addCheckupResultPayload = {
      appointmentId: this.selectedSwab.appointment_id,
      checkupResult: checkupResult,
      emailPatient: this.selectedSwab.email_address,
      emailStatus: sendEmail,
      userId: this.userId,
      userName: this.userName,
    }

    const add = await this.appointmentService.addCheckupResult(this.addCheckupResultPayload).toPromise()
    .then(res => {
      this.alertService.success('Email Send', false);
    })
    .catch(err => {
      this.alertService.error('Failed to save antigen result', false);
      return err
    })

    this.refreshPage();
    this.searchAppointment(false);

    return add;
  }

  async onChangeCheckupResult(event: any) {
    this.checkupResult = event.target.value
  }
  
  setMaxRangeOfDate(val:any) {

    const {type, date} = val

    if (type === 1) {

      const stringMaxDate = date.year + "/" + date.month +"/"+ date.day
      const maxAdmissionDate = moment(stringMaxDate)
      maxAdmissionDate.add(7, 'days')

      this.myDateRangePickerOptions = {
        dateFormat: 'dd/mm/yyyy',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        height: '35px',
        width: '240px',
        disableSince: {
          year: +(maxAdmissionDate.format("YYYY")),
          month: +(maxAdmissionDate.format("M")),
          day: +(maxAdmissionDate.format("D")),
        }
      }
    }
  }

  print() {
    this.alertService.error("Fitur print belum tersedia")
  }
}

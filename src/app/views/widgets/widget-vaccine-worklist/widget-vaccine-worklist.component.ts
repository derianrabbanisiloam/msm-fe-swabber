import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsentService } from '../../../services/consent.service';
import { AppointmentService } from '../../../services/appointment.service';
import * as moment from 'moment';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { AlertService } from '../../../services/alert.service';
import { dateFormatter } from '../../../utils/helpers.util';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IMyDrpOptions } from 'mydaterangepicker';
import { patientStatus } from '../../../variables/common.variable';
import { sourceApps } from '../../../variables/common.variable';
import { environment } from '../../../../environments/environment';
import { ModalRescheduleCheckupComponent } from '../../widgets/modal-reschedule-checkup/modal-reschedule-checkup.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-widget-vaccine-worklist',
  templateUrl: './widget-vaccine-worklist.component.html',
  styleUrls: ['./widget-vaccine-worklist.component.css']
})
export class WidgetVaccineWorklistComponent implements OnInit {
  public key: any = JSON.parse(localStorage.getItem('key'));
  public user = this.key.user;
  public assetPath = environment.ASSET_PATH;
  public patientStatus: any = patientStatus;
  public hospital = this.key.hospital;
  public alerts: Alert[] = [];
  public limit = 10;
  public offset = 0;
  public model: any = { 
    date: '', toDate: '', uniqueCode: '', birth: '', appDate: '',
    name: '', phoneNumber: '', patientStatus: null, isPreRegist: null};
  public showWaitMsg: boolean = false;
  public showNotFoundMsg: boolean = false;
  public isCanPrevPage: boolean = false;
  public isCanNextPage: boolean = false;
  public mask_birth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public vaccineWorklist: any;
  private page: number = 0;
  public myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd/mm/yyyy',
    height: '30px'
  };
  public datePickerModel: any = {};
  public todayDateISO: any = moment().format('YYYY-MM-DD');
  public selectedCancel: any;
  public closeResult: string;
  public selectedNote: any;

  constructor(
    private alertService: AlertService,
    private consentService: ConsentService,
    private appointmentService: AppointmentService,
    private modalService: NgbModal,
    modalSetting: NgbModalConfig,
  ) {
    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
   }

  ngOnInit() {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
    this.initializeDateRangePicker();
    this.getCollectionAlert();
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
    this.model.date = this.todayDateISO;
    this.model.toDate = this.todayDateISO;
    this.searchVaccineList(true);
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
      this.model.date = bYear + '-' + bMonth + '-' + bDay;
      this.model.toDate = eYear + '-' + eMonth + '-' + eDay;
      this.clearSearch();
      this.searchVaccineList(false);
    }
  }

  clearSearch() {
    this.model.uniqueCode = '';
    this.model.birth = '';
    this.model.appDate = '';
    this.model.name = '';
    this.model.phoneNumber = '';
    this.model.isPreRegist = null;
    this.model.patientStatus = null;
  }

  async searchVaccineList(search?: boolean) {
    this.offset = search ? 0 : this.offset;
    let { date, toDate, uniqueCode, birth, appDate, 
      name, phoneNumber, isPreRegist, patientStatus } = await this.model;

    let uniCode = uniqueCode ? uniqueCode.toUpperCase() : '';

    if (date || toDate || uniCode || birth || appDate || name || phoneNumber || isPreRegist || patientStatus) {
      this.getVaccineList(date, toDate, uniCode, birth, appDate, name, phoneNumber, isPreRegist, patientStatus);
    } else {
      this.getVaccineList();
    }
  }

  async getVaccineList(date = '', toDate = '', uniCode = '', birth = '', appDate = '', name = '', phoneNumber = '', 
    isPreRegist = null, patientStatus = '') {
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;

    const hospital = this.hospital.id;

    const limit = this.limit;
    const offset = this.offset;

    this.vaccineWorklist = await this.consentService.getVaccineWorklist(date, toDate, hospital, limit, offset, uniCode,
      birth, appDate, name, phoneNumber, isPreRegist, patientStatus)
      .toPromise().then(res => {
        if (res.data.length > 0) {

          this.isCanNextPage = res.data.length >= 10 ? true : false;

          for (let i = 0, { length } = res.data; i < length; i += 1) {
            res.data[i].new_birth_date = dateFormatter(res.data[i].birth_date, true);
            res.data[i].app_date = dateFormatter(res.data[i].appointment_date, true);
          }

          this.showWaitMsg = false;
          this.showNotFoundMsg = false;
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

  cancelAppointment(val, content) {
    this.selectedCancel = val;
    this.openconfirmation(content);
  }

  updateNote(val, content) {
    this.selectedNote = val;
    this.openconfirmation(content);
  }

  cancelAppUpdateNote(val, option){
    const registrationFormId = val.registration_form_id;
    let body;
    if(option === 'cancel') {
      body = {
        isCancelOrder: true
      };
    } else {
      body = {
        note: this.selectedNote.note
      };
    }

    this.appointmentService.deleteAppointmentVaccine(registrationFormId, body)
      .toPromise().then(res => {
        this.alertService.success(res.message, false, 3000);
        this.searchVaccineList(false);
      }).catch(err => {
        this.alertService.error(err.error.message, false, 3000);
      });
  }

  openconfirmation(content) {
    this.modalService.open(content, { windowClass: 'fo_modal_confirmation' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openRescheduleModal(appointmentSelected: any) {
    const modalRef = this.modalService.open(ModalRescheduleCheckupComponent,
      { windowClass: 'cc_modal_confirmation', size: 'lg' });
      modalRef.componentInstance.appointmentSelected = appointmentSelected;
  }

  nextPage() {
    this.page += 1;
    this.offset = this.page * 10;
    this.isCanPrevPage = this.offset === 0 ? false : true;
    this.searchVaccineList(false);
  }

  prevPage() {
    this.page -= 1;
    this.offset = this.page * 10;
    this.isCanPrevPage = this.offset === 0 ? false : true;
    this.searchVaccineList(false);
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

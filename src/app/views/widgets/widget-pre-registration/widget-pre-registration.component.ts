import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { AlertService } from '../../../services/alert.service';
import { dateFormatter } from '../../../utils/helpers.util';
import { environment } from '../../../../environments/environment';
import { AppointmentService } from '../../../services/appointment.service';
import { ScheduleService } from '../../../services/schedule.service'
import { DoctorService } from '../../../services/doctor.service';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateAppPreRegistrationComponent } from '../../widgets/modal-create-app-pre-registration/modal-create-app-pre-registration.component';
import { IMyDpOptions } from 'mydatepicker';
import { PaymentService } from '../../../services/payment.service';
import { paymentStatus } from '../../../variables/common.variable'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-widget-pre-registration',
  templateUrl: './widget-pre-registration.component.html',
  styleUrls: ['./widget-pre-registration.component.css']
})
export class WidgetPreRegistrationComponent implements OnInit {
  @ViewChild('getDetail') getDetail;
  public assetPath = environment.ASSET_PATH;
  public paymentStatus: any = paymentStatus
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd/mm/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    height: '27px',
    width: '150px',
    showInputField: true,
  };
  public user = this.key.user;
  public urlPreRegisFile = environment.GET_IMAGE;
  public orderList: any;
  public appPreList: any;
  public datePickerModel: any = {};
  public keywordsModel: KeywordsModel = new KeywordsModel;
  public alerts: Alert[] = [];
  public limit = 10;
  public offset = 0;
  public limitTwo = 10;
  public offsetTwo = 0;
  private page: number = 0;
  private pageTwo: number = 0;
  public isCanPrevPage: boolean = false;
  public isCanNextPage: boolean = false;
  public isCanPrevPageTwo: boolean = false;
  public isCanNextPageTwo: boolean = false;
  public model: any = {
    hospital_id: '', confirmCode: '', submitDate: '',
    name: '', checkupId: ''
  };
  public modelTwo: any = {
    orderId: '', isNew: null
  };
  public mask_birth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public showWaitMsg: boolean = false;
  public showNotFoundMsg: boolean = false;
  public showWaitMsgTwo: boolean = false;
  public showNotFoundMsgTwo: boolean = false;
  public closeResult: string;
  public now = new Date();
  public dateApp;
  public dateAppointment: any = {
    date: {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate(),
    }
  };
  public catTestList: any;
  public detailList: any;
  public flagDetail: boolean = false;
  public flagClose: boolean = false;
  public isNew: boolean;
  public searchKeywords: any = {
    checkup: {}
  };
  public orderDetail: any;
  public closeModal1: any;
  public paymentTotal: number;
  public dateNow: any = moment().format('YYYY-MM-DD');
  public confirmBut: boolean = false;
  public orderFromCreateApp: string;

  constructor(
    private doctorService: DoctorService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private appointmentService: AppointmentService,
    private scheduleService: ScheduleService,
    private paymentService: PaymentService,
    private modalService: NgbModal,
    modalSetting: NgbModalConfig,
    private router: Router,
  ) {
    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
  }

  ngOnInit() {
    this.getListCategoriesTest();
    this.initializeDateRangePicker();
    this.getOrder();
    this.emitCreateApp();
    this.emitOpenModal();
  }

  open50(content) {
    this.modalService.open(content, { windowClass: 'fo_modal_admission' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  emitCreateApp() {
    this.appointmentService.closeModalSource$.subscribe(
      async () => {
        this.closeModal1.click();
      }
    );
  }

  emitOpenModal() {
    this.appointmentService.openModalSource$.subscribe(
      async (data) => {
        this.orderFromCreateApp = data;
        if (this.orderFromCreateApp) {
          setTimeout(() => {
            this.flagDetail = true;
            this.modelTwo.orderId = this.orderFromCreateApp;
            this.listPreRegistration(this.orderFromCreateApp);
            this.open50(this.getDetail);
          }, 2000);
        }
      }
    );
  }

  onDateChange(val) {
    const { year, month, day } = val.date;

    if (year === 0 && month === 0 && day === 0) {
      this.clearSearch();
      this.orderList = [];
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
      this.searchOrderList(false);
    }
  }

  clearSearch() {
    this.model.confirmCode = '';
    this.model.submitDate = '';
    this.model.name = '';
    this.model.checkupId = '';
  }

  createPatient(item, closeModal) {
    this.flagClose = false;
    this.closeModal1 = closeModal;

    this.searchKeywords = {
      fromPreRegis: true,
      fromPatientData: true,
      patientPreReg: item,
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
    setTimeout(() => {
      this.closeModal1.click();
    }, 500);
    this.router.navigate(['/patient-data'], { queryParams: params });
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
      this.getOrder();
    }
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

  async searchOrderList(search?: boolean) {
    this.offset = search ? 0 : this.offset;
    let { confirmCode, submitDate, checkup_id, name } = await this.model;

    submitDate = submitDate ? this.fixDate(submitDate) : '';

    if (confirmCode || submitDate || checkup_id || name) {
      this.getOrder(confirmCode, submitDate, checkup_id, name);
    } else {
      this.getOrder();
    }
  }

  async searchPreRegistration(search?: boolean) {
    this.offsetTwo = search ? 0 : this.offsetTwo;
    let { isNew, orderId } = await this.modelTwo;

    if (isNew !== null) {
      this.listPreRegistration(orderId, isNew);
    } else {
      this.listPreRegistration(orderId);
    }
  }

  async getOrder(confirmCode = '', submitDate = '', checkup_id = '', name = '') {
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    
    const { year, month, day } = this.dateAppointment.date;
    const strDate = year + '-' + month + '-' + day;
    const date = dateFormatter(strDate, false);
    this.dateApp = date;
    const hospital = this.hospital.id;

    const limit = this.limit;
    const offset = this.offset;

    this.orderList = await this.appointmentService.getOrderList(date, hospital, limit, offset, confirmCode, submitDate,
      name)
      .toPromise().then(res => {
        if (res.data.length > 0) {

          this.isCanNextPage = res.data.length >= 10 ? true : false;

          for (let i = 0, { length } = res.data; i < length; i += 1) {
            res.data[i].submit_date = dateFormatter(res.data[i].created_at, true);
            res.data[i].custome_appointment_date = dateFormatter(res.data[i].appointment_date, true);
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

  open(modal) {
    this.modalService.open(modal, { windowClass: 'modal_verification-2', size: 'lg' });
  }

  openTwo(modal) {
    this.modalService.open(modal, { windowClass: 'modal_verification-3', size: 'lg' });
  }

  openDetailList(val, content) {
    this.orderDetail = val;
    localStorage.setItem('orderDetail', JSON.stringify(this.orderDetail));
    this.flagDetail = true;
    this.open(content);
    this.modelTwo.orderId = val.order_id;
    this.listPreRegistration(val.order_id);
  }

  openPaymentModal(val, content) {
    this.orderDetail = val;
    this.openTwo(content);
  }

  openConfirmationModal(content) {
    this.openTwo(content);
  }

  async paymentProcess() {
    this.confirmBut = true;
    let body = {
      organization_id: this.hospital.orgId,
      admission_id: 0,
      organization_name: this.hospital.name,
      admission_no: '',
      admission_date: this.dateNow,
      mobile_no: this.orderDetail.phone_number,
      email_address: this.orderDetail.email,
      patient_name: this.orderDetail.name,
      description: this.orderDetail.package_name,
      payment_amount: this.paymentTotal,
      type_payment: 'CASHIER_EXPRESS',
      user_id: this.user.id,
      invoice_no: this.orderDetail.confirmation_code
    }

    await this.paymentService.payment(body).toPromise().then(
      data => {
        this.paymentTotal = null;
        this.confirmBut = false;
        this.modalService.dismissAll();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Success',
          text: 'Successful Payment',
          showConfirmButton: false,
          timer: 2000
        })
        this.updatePayment(data.data.payment_code, this.orderDetail.order_id);
        this.getOrder();
      }, err => {
        Swal.fire({
          position: 'center',
          type: 'error',
          title: err.error.message,
          showConfirmButton: false,
          timer: 3000
        })
      }
    );

  }

  async updatePayment(paymentCode, orderId) {
    let body = {
      paymentCode: paymentCode
    }
    await this.paymentService.paymentForMySiloam(body, orderId).toPromise().then();
  }

  async listPreRegistration(orderId, isNew = null) {
    this.showWaitMsgTwo = true;
    this.showNotFoundMsgTwo = false;

    const limit = this.limitTwo;
    const offset = this.offsetTwo;

    this.appPreList = await this.appointmentService.getPreRegistrationList(orderId, limit, offset, isNew)
      .toPromise().then(res => {
        if (res.data.length > 0) {

          this.isCanNextPageTwo = res.data.length >= 10 ? true : false;

          for (let i = 0, { length } = res.data; i < length; i += 1) {
            res.data[i].new_birth_date = dateFormatter(res.data[i].birth_date, true);
          }

          this.showWaitMsgTwo = false;
          this.showNotFoundMsgTwo = false;
        } else {
          this.showWaitMsgTwo = false;
          this.showNotFoundMsgTwo = true;
        }
        return res.data;
      }).catch(err => {
        this.showWaitMsgTwo = false;
        this.showNotFoundMsgTwo = true;
        this.alertService.error(err.error.message, false, 3000);
        return [];
      });
  }

  async getListCategoriesTest() {
    this.alerts = [];
    this.catTestList = await this.scheduleService.getCategoriesTestList(this.hospital.id)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        this.alertService.error(err.error.message);
        return [];
      });
  }

  searchSchedule(item) {
    const idx = this.catTestList.findIndex((i) => {
      return i.checkup_id === this.orderDetail.hope_salesitem_category_id;
    })

    this.searchKeywords = {
      fromPreRegis: true,
      patientPreReg: item,
      orderDetail: this.orderDetail
    };

    let searchKey = {
      type: 'params',
    };

    this.doctorService.searchDoctorSource2 = this.searchKeywords;
    this.router.navigate(['/base-appointment'], { queryParams: searchKey });
    localStorage.setItem('searchKey', JSON.stringify(searchKey));
  }

  async searchPatient(val, closeModal) {
    this.closeModal1 = closeModal;
    const modalRef = this.modalService.open(ModalCreateAppPreRegistrationComponent, { windowClass: 'modal_verification', size: 'lg' });
    modalRef.componentInstance.appPreRegisSelected = val;
    modalRef.componentInstance.orderDetailSelected = this.orderDetail;
  }

  async fixDate(date) {
    let birth;
    let wDate = date.split('-');
    birth = wDate ? wDate[2] + '-' + wDate[1] + '-' + wDate[0] : '';
    return birth
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

  nextPage() {
    this.page += 1;
    this.offset = this.page * 10;
    this.isCanPrevPage = this.offset === 0 ? false : true;
    this.searchOrderList(false);
  }

  nextPageTwo() {
    this.pageTwo += 1;
    this.offsetTwo = this.pageTwo * 10;
    this.isCanPrevPageTwo = this.offsetTwo === 0 ? false : true;
    this.searchPreRegistration(false);
  }

  prevPage() {
    this.page -= 1;
    this.offset = this.page * 10;
    this.isCanPrevPage = this.offset === 0 ? false : true;
    this.searchOrderList(false);
  }

  prevPageTwo() {
    this.pageTwo -= 1;
    this.offsetTwo = this.pageTwo * 10;
    this.isCanPrevPageTwo = this.offsetTwo === 0 ? false : true;
    this.searchPreRegistration(false);
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
  doctorId: any;
  isDoubleMr: boolean;
  admStatus: string;
  payStatus: string;
  offset: number;
  limit: number;
}

import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { BpjsService } from '../../../services/bpjs.service';
import { AlertService } from '../../../services/alert.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import { NgbModal, NgbModalConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { sourceApps, consultationType, pathImage } from '../../../variables/common.variable';
import { IMyDpOptions } from 'mydatepicker';
import { environment } from '../../../../environments/environment';
import { Speciality } from '../../../models/specialities/speciality';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-widget-request-list',
  templateUrl: './widget-request-list.component.html',
  styleUrls: ['./widget-request-list.component.css']
})
export class WidgetRequestListComponent implements OnInit {
  public key: any = JSON.parse(localStorage.getItem('key'));
  public user = this.key.user;
  public hospital: any = this.key.hospital;
  public assetPath = environment.ASSET_PATH;
  public urlBpjsCard = environment.GET_IMAGE+pathImage.BPJS_CARD;
  public todayDateISO: any = moment().format('YYYY-MM-DD');
  public myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd/mm/yyyy',
    height: '30px'
  };
  public datePickerModel: any = {};
  public keywordsModel: KeywordsModel = new KeywordsModel;
  public maskBirth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public alerts: Alert[] = [];
  public showWaitMsg: boolean = false;
  public showNotFoundMsg: boolean = false;
  public isCanPrevPage: boolean = false;
  public isCanNextPage: boolean = false;
  public closeResult: string;
  public count: number = -1;
  public selectedApp: any;
  public bodyKeyword: any = { valueOne: null, valueTwo: null, valueThree: null, valueFour: null };
  public bodyKeywordTwo: any = { valueOne: null, valueTwo: null, valueThree: null, valueFour: null };
  public searchKeywords: any = {
    doctor: {},
    area: {},
    hospital: {},
    speciality: {}
  };
  public showSchedule: boolean = false;
  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd/mm/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    height: '27px',
    width: '150px',
    showInputField: true,
  };
  public now = new Date();
  public dateAppointment: any = {
    date: {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate(),
    }
  };
  public appRequestList: any = [];
  public selectedPat: any;
  public specialities: Speciality[];
  public butdownload: boolean = false;
  public checkAll: boolean = false;

  constructor(
    private doctorService: DoctorService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private bpjsService: BpjsService,
    modalSetting: NgbModalConfig,
    private router: Router,
  ) {
    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
   }

  ngOnInit() {
    if(this.doctorService.goBack) { //when click prev page
      this.showSchedule = false;
    }
    this.getSpecialities();
    this.keywordsModel.hospitalId = this.hospital.id;
    this.initializeDateRangePicker();
    this.getCollectionAlert();
    this.getAppointmentBpjs();
  }

  async getSpecialities(specialityname = null, total = null) {
    this.specialities = await this.doctorService.getSpecialities(specialityname, total)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        this.alertService.error(err.error.message);
        return [];
      });

    if (this.specialities.length !== 0) {
      this.specialities.map(x => {
        x.speciality_name = isEmpty(x.speciality_name) ? '' : x.speciality_name;
      });
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

  getImage(fileName) {
    window.open(this.urlBpjsCard + fileName, '_blank', "status=1");
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

  async getAppointmentBpjs() {
    this.count+=1;
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    let offsetTemp;
    const {
      hospitalId = '', fromDate = this.todayDateISO, toDate = this.todayDateISO,
      patientName = '', birthDate = '', noBpjs = '',  offset = 0, specialtyId = '', limit = 10
    } = await this.keywordsModel;
    offsetTemp = offset;
    
    if(this.count === 0) {
      this.bodyKeyword.valueOne = hospitalId, this.bodyKeyword.valueTwo = fromDate, this.bodyKeyword.valueThree = toDate;
      this.bodyKeyword.valueFour = patientName, this.bodyKeyword.valueFive = birthDate;
      this.bodyKeyword.valueSix = noBpjs, this.bodyKeyword.valueSeven = specialtyId;

      this.bodyKeywordTwo.valueOne = hospitalId, this.bodyKeywordTwo.valueTwo = fromDate, this.bodyKeywordTwo.valueThree = toDate;
      this.bodyKeywordTwo.valueFour = patientName, this.bodyKeyword.valueFive = birthDate;
      this.bodyKeyword.valueSix = noBpjs, this.bodyKeyword.valueSeven = specialtyId;
    } else if(this.count > 0) {
      this.bodyKeyword.valueOne = hospitalId, this.bodyKeyword.valueTwo = fromDate, this.bodyKeyword.valueThree = toDate;
      this.bodyKeyword.valueFour = patientName, this.bodyKeyword.valueFive = birthDate;
      this.bodyKeyword.valueSix = noBpjs, this.bodyKeyword.valueSeven = specialtyId;

      if(this.bodyKeyword.valueOne !== this.bodyKeywordTwo.valueOne || this.bodyKeyword.valueTwo !== this.bodyKeywordTwo.valueTwo ||
        this.bodyKeyword.valueThree !== this.bodyKeywordTwo.valueThree || this.bodyKeyword.valueFour !== this.bodyKeywordTwo.valueFour ||
        this.bodyKeyword.valueFive !== this.bodyKeywordTwo.valueFive || this.bodyKeyword.valueSix !== this.bodyKeywordTwo.valueSix ||
        this.bodyKeyword.valueSeven !== this.bodyKeywordTwo.valueSeven) {    
          this.bodyKeywordTwo.valueOne = hospitalId, this.bodyKeywordTwo.valueTwo = fromDate, this.bodyKeywordTwo.valueThree = toDate;
          this.bodyKeywordTwo.valueFour = patientName, this.bodyKeyword.valueFive = birthDate;
          this.bodyKeyword.valueSix = noBpjs, this.bodyKeywordTwo.valueSeven = specialtyId;
        
          this.page = 0;
          offsetTemp = 0;
          this.keywordsModel.offset = offsetTemp;
          this.isCanPrevPage = offsetTemp === 0 ? false : true;
      }
    }

    this.bpjsService.getListAppointmentBpjs(
      hospitalId,
      fromDate,
      toDate,
      patientName,
      birthDate,
      noBpjs,
      specialtyId,
      offsetTemp,
      limit
    ).subscribe(
      data => {
        if (data.data.length !== 0) {
          this.showWaitMsg = false;
          this.showNotFoundMsg = false;
          this.appRequestList = data.data;

          this.appRequestList.map(x => {
            x.patient_birth_date = moment(x.patient_birth_date).format('DD-MM-YYYY');
            x.appointment_date = moment(x.appointment_date).format('DD-MM-YYYY');
            x.checked = false;
            let fixDate;
            fixDate = x.created_date.substr(0, 10);
            x.created_date = moment(fixDate).format('DD-MM-YYYY');;
          });
          this.isCanNextPage = this.appRequestList.length >= 10 ? true : false;
        }
        else {
          this.appRequestList = null;
          this.showWaitMsg = false;
          this.showNotFoundMsg = true;
          this.isCanNextPage = false;
        }
      }, error => {
       this.showWaitMsg = false;
       this.showNotFoundMsg = true;
       this.alertService.error(error.error.message, false, 3000);
     }
    );
  }

  cancelRequestBpjs() {
    const appointmentId = this.selectedPat.appointment_bpjs_id;
    const body = { 
      userNameFromToken: 'siloam',
      userId: this.user.id,
      userName: this.user.fullname,
      source: sourceApps
    };

    this.bpjsService.deleteAppointmentBpjs(appointmentId, body)
      .toPromise().then(res => {
        this.getAppointmentBpjs();
        this.alertService.success(res.message, false, 3000);
      }).catch(err => {
        this.alertService.error(err.error.message, false, 3000);
      })
  }

  downloadDoc() {
    let body;
    let tampung = [];
    if(this.appRequestList) {
      this.appRequestList.map(x => {
        if(x.checked === true) {
          tampung.push(x)
        } 
      });
    }

    // body = {
    //   appBpjsId: tampung,
    //   userId: this.user.id,
    //   userName: this.user.fullname,
    //   source: sourceApps
    // }

    // this.bpjsService.notifyBpjs(body)
    //   .subscribe(data => {
    //     this.getAppointmentBpjs();
    //     this.alertService.success('Success update to BPJS', false, 3000);
    //   }, err => {
    //     this.alertService.error(err.error.message);
    //   }
    // );
  }

  CheckAllOptions() {
    if (this.appRequestList.every(val => val.checked == false)) {
        this.appRequestList.forEach(val => { val.checked = true });
      }
    else {
      this.appRequestList.forEach(val => { val.checked = false });
    }
  }

  openModalCancel(content, body) {
    this.selectedPat = body;
    this.open(content);
  }

  open(content) {
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

  private page: number = 0;
  nextPage() {
    this.checkAll = false;
    this.appRequestList.map(x => {
      x.checked = false;
    });
    this.page += 1;
    this.keywordsModel.offset = this.page * 10;
    this.isCanPrevPage = this.keywordsModel.offset === 0 ? false : true;
    this.getAppointmentBpjs();
  }
  prevPage() {
    this.checkAll = false;
    this.appRequestList.map(x => {
      x.checked = false;
    });
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

  searchSchedule2(body) {
    const speciality = body;

    this.searchKeywords = {
      doctor: {
        doctor_id: null,
        name: null,
      },
      area: {
        area_id: null,
        name: null,
      },
      hospital: {
        hospital_id: this.hospital.id,
        name: this.hospital.name,
      },
      speciality: {
        speciality_id: speciality.speciality_id,
        speciality_name: speciality.speciality_name,
      },
      fromBpjs: true,
      fromRegistration: false,
      patientBpjs: body,
      //consulType: consultationType.BPJS
    };

    const searchKey = {
      type: 'spesialist',
      speciality_id: speciality.speciality_id,
      speciality_name: speciality.speciality_name,
    };

    this.doctorService.searchDoctorSource2 = this.searchKeywords;
    this.router.navigate(['/doctor-schedule'], {
      queryParams: {
        fromBpjs: true,
        fromRegistration: false
      }
    });
    localStorage.setItem('searchKey', JSON.stringify(searchKey));
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
  noBpjs: string;
  specialtyId: string;
  offset: number;
  limit: number;
}

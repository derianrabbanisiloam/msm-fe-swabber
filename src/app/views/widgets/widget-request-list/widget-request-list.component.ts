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
  public urlBpjsCard = environment.GET_IMAGE;
  public todayDateISO: any = moment().add(1, 'days').format('YYYY-MM-DD');
  public myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd/mm/yyyy',
    height: '30px',
  };
  public myDateRangeCreatedDate: IMyDrpOptions;
  public datePickerModel: any = {};
  public datePickerCreatedDate: any = {};
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
  public bodyKeyword: any = { 
    valueOne: null, valueTwo: null, valueThree: null, valueFour: null, valueFive: null,
    valueSix: null, valueSeven: null, valueEight: null };
  public bodyKeywordTwo: any = { 
    valueOne: null, valueTwo: null, valueThree: null, valueFour: null, valueFive: null,
    valueSix: null, valueSeven: null, valueEight: null };
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
    let today = this.todayDateISO.split('-');
    this.myDateRangeCreatedDate = {
      dateFormat: 'dd/mm/yyyy',
      height: '30px',
      width: '100px',
      editableDateRangeField: false,
      disableSince: { year: today[0], month: today[1], day: today[2] }
    };
    if(this.doctorService.goBack) { //when click prev page
      this.showSchedule = false;
    }
    this.getSpecialities();
    this.keywordsModel.hospitalId = this.hospital.id;
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

  getImage(fileName) {
    let split = fileName.split('-');
    let pathFile = split[0];
    window.open(this.urlBpjsCard +'/'+ pathFile +'/'+ fileName, '_blank', "status=1");
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
      if(this.keywordsModel.fromDate === '0-00-00' 
        && this.keywordsModel.toDate === '0-00-00') {
          this.keywordsModel.fromDate = '';
          this.keywordsModel.toDate = '';
          this.getAppointmentBpjs();
      } else {
        this.getAppointmentBpjs();
      }
    }
  }

  changeDateRangeCreatedDate(dateRange: any) {
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
      this.keywordsModel.createFrom = bYear + '-' + bMonth + '-' + bDay;
      this.keywordsModel.createTo = eYear + '-' + eMonth + '-' + eDay;
      if(this.keywordsModel.createFrom === '0-00-00' 
        && this.keywordsModel.createTo === '0-00-00') {
          this.keywordsModel.createFrom = '';
          this.keywordsModel.createTo = '';
          this.getAppointmentBpjs();
      } else {
        this.getAppointmentBpjs();
      }
    }
  }

  async getAppointmentBpjs() {
    this.count+=1;
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    let offsetTemp;
    const {
      hospitalId = this.hospital.id, fromDate = '', toDate = '', createFrom = '', createTo = '',
      patientName = '', birthDate = '', noBpjs = '',  offset = 0, specialtyId = '', limit = 10
    } = await this.keywordsModel;
    offsetTemp = offset;
    let fixBirthDate = null;
    if(birthDate) {
      let split = birthDate.split('-');
      fixBirthDate = split[2]+'-'+split[1]+'-'+split[0];
    }
    const specialty = specialtyId ? specialtyId.speciality_id : '';
    
    if(this.count === 0) {
      this.bodyKeyword.valueOne = hospitalId, this.bodyKeyword.valueTwo = fromDate, this.bodyKeyword.valueThree = toDate;
      this.bodyKeyword.valueFour = patientName, this.bodyKeyword.valueFive = fixBirthDate;
      this.bodyKeyword.valueSix = noBpjs, this.bodyKeyword.valueSeven = createFrom, this.bodyKeyword.valueEight = createTo;

      this.bodyKeywordTwo.valueOne = hospitalId, this.bodyKeywordTwo.valueTwo = fromDate, this.bodyKeywordTwo.valueThree = toDate;
      this.bodyKeywordTwo.valueFour = patientName, this.bodyKeywordTwo.valueFive = fixBirthDate;
      this.bodyKeywordTwo.valueSix = noBpjs, this.bodyKeywordTwo.valueSeven = createFrom, this.bodyKeywordTwo.valueEight = createTo;
    } else if(this.count > 0) {
      this.bodyKeyword.valueOne = hospitalId, this.bodyKeyword.valueTwo = fromDate, this.bodyKeyword.valueThree = toDate;
      this.bodyKeyword.valueFour = patientName, this.bodyKeyword.valueFive = fixBirthDate;
      this.bodyKeyword.valueSix = noBpjs, this.bodyKeyword.valueSeven = createFrom, this.bodyKeyword.valueEight = createTo;

      if(this.bodyKeyword.valueOne !== this.bodyKeywordTwo.valueOne || this.bodyKeyword.valueTwo !== this.bodyKeywordTwo.valueTwo ||
        this.bodyKeyword.valueThree !== this.bodyKeywordTwo.valueThree || this.bodyKeyword.valueFour !== this.bodyKeywordTwo.valueFour ||
        this.bodyKeyword.valueFive !== this.bodyKeywordTwo.valueFive || this.bodyKeyword.valueSix !== this.bodyKeywordTwo.valueSix ||
        this.bodyKeyword.valueSeven !== this.bodyKeywordTwo.valueSeven || this.bodyKeyword.valueEight !== this.bodyKeywordTwo.valueEight) {
          this.bodyKeywordTwo.valueOne = hospitalId, this.bodyKeywordTwo.valueTwo = fromDate, this.bodyKeywordTwo.valueThree = toDate;
          this.bodyKeywordTwo.valueFour = patientName, this.bodyKeywordTwo.valueFive = fixBirthDate;
          this.bodyKeywordTwo.valueSix = noBpjs, this.bodyKeywordTwo.valueSeven = createFrom, this.bodyKeywordTwo.valueSeven = createTo;
        
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
      fixBirthDate,
      noBpjs,
      specialty,
      offsetTemp,
      limit,
      createFrom,
      createTo
    ).subscribe(
      data => {
        if (data.data.length !== 0) {
          this.showWaitMsg = false;
          this.showNotFoundMsg = false;
          this.appRequestList = data.data;
          this.appRequestList.map(x => {
            x.patient_birth_date = moment(x.patient_birth_date).format('DD-MM-YYYY');
            x.appointment_date = moment(x.appointment_date).format('DD-MM-YYYY');
            let fixDate;
            fixDate = x.created_date.substr(0, 10);
            x.created_date = moment(fixDate).format('DD-MM-YYYY');
          });
          console.log('this.applist', this.appRequestList)
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
      consulType: consultationType.BPJS+':'+consultationType.BPJS_REGULER
    };

    const searchKey = {
      type: 'spesialist',
      speciality_id: speciality.speciality_id,
      speciality_name: speciality.speciality_name,
    };

    this.doctorService.searchDoctorSource2 = this.searchKeywords;
    this.router.navigate(['/bpjs-registration'], {
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
  createFrom: string;
  createTo: string;
  patientName: string;
  localMrNo: string;
  birthDate: string;
  doctorId: any;
  isDoubleMr: boolean;
  admStatus: string;
  noBpjs: string;
  specialtyId: any;
  offset: number;
  limit: number;
}

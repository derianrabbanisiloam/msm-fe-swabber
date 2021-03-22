import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { ScheduleService } from '../../../services/schedule.service';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';
import { environment } from '../../../../environments/environment';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-widget-vaccine-schedule',
  templateUrl: './widget-vaccine-schedule.component.html',
  styleUrls: ['./widget-vaccine-schedule.component.css']
})
export class WidgetVaccineScheduleComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  @Output() public opScheduleSelected = new EventEmitter<any>();

  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public keywords: any = {};
  private dates: any = [];
  public checkUpSchedules: any = [{
    checkUpId: null,
    schedules: []
  }];
  public checkUpTemp: any;
  public showScheduleType1: boolean = false;
  public showScheduleType2: boolean = false;
  public todayDateISO: any = moment().format('YYYY-MM-DD');
  public todayDateISOBPJS: any;
  public initDate: any = moment().format('YYYY-MM-DD');
  public startDateOfWeek = moment().startOf('isoWeek');
  public message1: any;
  public btnActive: any = {
    prevWeek: true,
    thisWeek: false,
    nextWeek: true,
  };
  public isOriginal: boolean = true;
  public isForeign: boolean = false;
  private leaves = [];
  public holidaysSpecialty: any = [];
  public holidaysName: any = [];
  public fromBpjs: boolean = false;
  public fromRegistration: boolean = false;
  public patFromBpjs: any;
  public bodyBpjs: any;
  public reschBpjs: boolean = false;

  public datePickerModel: any = {
    date: {
      year: parseInt(moment().format('YYYY')),
      month: parseInt(moment().format('MM')),
      day: parseInt(moment().format('DD'))
    }
  };
  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd/mm/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    height: '27px',
    width: '150px',
    showInputField: true,
  };
  public myDateRangePickerOptionsTwo: IMyDpOptions;
  public today: any;

  public consulType: string = null;
  public consulTypeFlag: number;
  public flagCon: number;
  public checkupName: string;
  public fromVaccineWorklist: boolean = false;
  public bodyPreReg: any;
  public patientDetail: any;
  public day1week: string;
  public day7week: string;

  constructor(
    private doctorService: DoctorService,
    private scheduleService: ScheduleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  async ngOnInit() {
    if (this.doctorService.searchDoctorSource2) {
      if (this.doctorService.searchDoctorSource2.fromVaccineWorklist === true) {
        this.patientDetail = this.doctorService.searchDoctorSource2.vaccinePatData;
        this.fromVaccineWorklist = true;
        if(this.patientDetail.appointment_date){
          let fixDate = this.patientDetail.appointment_date.split('-');
          this.initDate = this.patientDetail.appointment_date;
          this.datePickerModel.date.year = parseInt(fixDate[0]);
          this.datePickerModel.date.month = parseInt(fixDate[1]);
          this.datePickerModel.date.day = parseInt(fixDate[2]);
        }
      }
      this.keywords = this.doctorService.searchDoctorSource2;
    } 
    this.doctorService.searchDoctorSource2 = null;
    await this.getLeaveHeader(this.keywords);
    await this.generateDates(this.initDate);
    await this.getSchedulesLogic(this.keywords);
    this.doctorService.searchDoctorSource$.subscribe(
      async (params) => {
        this.keywords = params;
        await this.getLeaveHeader(this.keywords);
        await this.generateDates(this.initDate);
        await this.getSchedulesLogic(this.keywords);
      }
    );
  }

  getSchedulesLogic(keywords: any) {
    let isDriveThru = null;
    this.isOriginal = keywords.original != undefined ? keywords.original : true;
    this.getCheckUpSchedulesById(keywords.checkup.checkup_id, isDriveThru);
  }

  async generateDates(selectedDate?: any) {
    this.dates = [];
    let dateChoosed = selectedDate ? moment(selectedDate) : moment();
    let now = dateChoosed.startOf('isoWeek').format('YYYY-MM-DD');
    let date: any = now ? moment(now).startOf('week') : moment().startOf('week');
    let dateTemp: any;
    let dateHeader: any;
    let dateISO: any;
    let dateDay: any;
    for (let i = 0, length = 7; i < length; i++) {
      dateTemp = date.add(1, 'days');
      dateHeader = dateTemp.format('dddd, DD-MM-YYYY');
      dateISO = dateTemp.format('YYYY-MM-DD');
      dateDay = dateTemp.format('E');
      this.dates.push({ dateHeader, dateISO, dateDay });
      for (let l = 0, lengthTwo = this.leaves.length; l < lengthTwo; l++) {
        if (moment(this.dates[i].dateISO) >= moment(this.leaves[l].from_date) && moment(this.dates[i].dateISO) <= moment(this.leaves[l].to_date)) {
          this.holidaysSpecialty.push(this.leaves[l].checkup_id + '-' + this.dates[i].dateISO + '-' + this.leaves[l].hospital_id);
          this.holidaysName.push(this.leaves[l].notes);
        }
      }
    }
    this.day1week = this.dates[0].dateISO;
    this.day7week = this.dates[6].dateISO;
  }

  getCheckUpSchedulesById(checkup_id: any, isDriveThru?) {
    this.scheduleService.getCheckUpSchedule(this.hospital.id, checkup_id, null, 
      isDriveThru, this.day1week, this.day7week).subscribe(data => {
        this.checkUpTemp = data.data;
        if (data.data.length > 0) {
          this.checkUpSchedules[0].checkUpId = this.checkUpTemp[0].checkup_id;
          this.checkUpSchedules[0].schedules = this.checkUpTemp;
          this.checkupName = this.checkUpSchedules[0].checkup_name;
          this.showScheduleType1 = false;
          this.showScheduleType2 = true;
          this.message1 = null;
        } else {
          this.showScheduleType2 = false;
          this.showScheduleType1 = true;
          this.message1 = {
            title: 'Data tidak ditemukan',
            description: ''
          };
        }
      });
      
  }

  async getLeaveHeader(keywords: any) {
    const checkUpId = keywords.checkup ? keywords.checkup.checkup_id : null;
    if(checkUpId) {
      this.leaves = await this.scheduleService.getLeaveHeaderCheckUp(this.hospital.id, checkUpId).toPromise().then(
          data => {
            return data.data;
          }
        );
    }
  }

  gotoDate(dateSelected: any) {
    let d = dateSelected.date.day;
    d = d < 10 ? '0' + d : d.toString();
    let m = dateSelected.date.month.toString();
    m = m < 10 ? '0' + m : m.toString();
    const y = dateSelected.date.year.toString();
    const dateChoosed = moment(`${y}-${m}-${d}`);
    const dateStart = dateChoosed.startOf('isoWeek').format('YYYY-MM-DD');
    this.generateDates(dateStart);
    this.initDate = dateStart;
    this.keywords.date = dateStart;
    this.doctorService.changeSearchDoctor(this.keywords);
    this.btnActive.thisWeek = moment(this.initDate).startOf('isoWeek').date() == moment().startOf('isoWeek').date() ? false : true;
  }

  async gotoNextWeek() {
    this.btnActive.nextWeek = false;
    const date = moment(this.initDate);
    date.add(7, 'days');
    this.initDate = date.format('YYYY-MM-DD');
    this.generateDates(this.initDate);
    this.keywords.date = this.initDate;
    await this.doctorService.changeSearchDoctor(this.keywords);
    this.btnActive.thisWeek = moment(this.initDate).startOf('isoWeek').date() == moment().startOf('isoWeek').date() ? false : true;
    this.btnActive.nextWeek = true;
  }

  async gotoPrevWeek() {
    this.btnActive.prevWeek = false;
    const date = moment(this.initDate);
    date.subtract(7, 'days');
    this.initDate = date.format('YYYY-MM-DD');
    this.generateDates(this.initDate);
    this.keywords.date = this.initDate;
    await this.doctorService.changeSearchDoctor(this.keywords);
    this.btnActive.thisWeek = moment(this.initDate).startOf('isoWeek').date() == moment().startOf('isoWeek').date() ? false : true;
    this.btnActive.prevWeek = true;
  }

  async gotoThisWeek() {
    this.btnActive.thisWeek = false;
    const date = moment();
    this.initDate = date.format('YYYY-MM-DD');
    this.generateDates(this.initDate);
    this.keywords.date = this.initDate;
    this.doctorService.changeSearchDoctor(this.keywords);
  }

  gotoCreateApp(item: any, date: string) {
    const searchKey = JSON.parse(localStorage.getItem('searchKey'));
    if (searchKey.checkup_id === 'All') {
      let setSearchKey = {
        checkup_id: item.checkup_id,
        checkup_name: item.checkup_name
      }
      localStorage.setItem('searchKey', JSON.stringify(setSearchKey));
    }
    this.router.navigate(['/create-appointment'], {
      queryParams: {
        checkupId: item.checkup_id,
        date: date,
        day: item.day,
        checkUpName: item.checkup_name,
        checkUpScheduleId: item.checkup_schedule_id,
        fromVaccineWorklist: this.fromVaccineWorklist
      }
    });

  }

  gotoCreateApp2(item: any, date: string) {
    const output = { ...item, date }
    this.opScheduleSelected.emit(output);
  }
}

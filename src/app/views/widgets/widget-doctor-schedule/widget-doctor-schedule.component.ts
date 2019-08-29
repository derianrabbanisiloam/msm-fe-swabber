import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorSchedule } from '../../../models/doctors/doctor-schedules';
import { DoctorSchedule2 } from '../../../models/doctors/doctor-schedules-2';
import { DoctorService } from '../../../services/doctor.service';
import { ScheduleService } from '../../../services/schedule.service';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';
import { isEmpty } from 'lodash';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-widget-doctor-schedule',
  templateUrl: './widget-doctor-schedule.component.html',
  styleUrls: ['./widget-doctor-schedule.component.css']
})
export class WidgetDoctorScheduleComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  @Output() public opScheduleSelected = new EventEmitter<any>();

  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public keywords: any = {};
  private dates: any = [];
  public doctorSchedules1: DoctorSchedule[];
  public doctorSchedules2: DoctorSchedule2[];
  public showScheduleType1: boolean = false;
  public showScheduleType2: boolean = false;
  public todayDateISO: any = moment().format('YYYY-MM-DD');
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

  constructor(
    private doctorService: DoctorService,
    private scheduleService: ScheduleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  async ngOnInit() {
    if (this.doctorService.searchDoctorSource2) {
      this.keywords = this.doctorService.searchDoctorSource2;
      this.doctorService.searchDoctorSource2 = null;
      await this.getLeaveHeader(this.keywords);
      await this.generateDates(this.initDate);
      await this.getSchedulesLogic(this.keywords);
    }

    this.doctorService.searchDoctorSource$.subscribe(
      async (params) => {
        this.keywords = params;
        await this.getLeaveHeader(this.keywords);
        await this.generateDates(this.initDate);
        await this.getSchedulesLogic(this.keywords);
      }
    );

    this.initForeignSource();
  }

  initForeignSource() {
    const id = this.activatedRoute.snapshot.queryParamMap.get('doctor_id');
    const name = this.activatedRoute.snapshot.queryParamMap.get('doctor_name');

    if (id && name) {
      this.keywords = {
        doctor: {
          doctor_id: id,
          name: name,
        },
      };
      this.isForeign = true;

      this.getLeaveHeader(this.keywords);
      this.generateDates(this.initDate);
      this.getSchedulesLogic(this.keywords);
    }
  }

  getSchedulesLogic(keywords: any) {
    const doctorId = keywords.doctor ? keywords.doctor.doctor_id : null;
    const areaId = keywords.area ? keywords.area.area_id : null;
    const hospitalId = keywords.hospital ? keywords.hospital.hospital_id : null;
    const specialityId = keywords.speciality ? keywords.speciality.speciality_id : null;
    this.isOriginal = keywords.original != undefined ? keywords.original : true;
    if (doctorId) {
      this.getSchedulesByDoctor(doctorId, this.initDate);
    } else if ((areaId || hospitalId) && specialityId) {
      this.getSchedulesByKeywords(specialityId, this.initDate, areaId, hospitalId);
    }
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
    for (let i=0, length=7; i<length; i++) {
      dateTemp = date.add(1, 'days');
      dateHeader = dateTemp.format('dddd, DD-MM-YYYY');
      dateISO = dateTemp.format('YYYY-MM-DD');
      dateDay = dateTemp.format('E');
      this.dates.push({ dateHeader, dateISO, dateDay });
      for(let l=0, lengthTwo=this.leaves.length; l<lengthTwo; l++) {
          if(moment(this.dates[i].dateISO) >= moment(this.leaves[l].from_date) && moment(this.dates[i].dateISO) <= moment(this.leaves[l].to_date)) {
            this.holidaysSpecialty.push(this.leaves[l].doctor_id+'-'+this.dates[i].dateISO+'-'+this.leaves[l].hospital_id);
            this.holidaysName.push(this.leaves[l].schedule_type_name);
          }
      }
      
    }
  }

  getSchedulesByDoctor(doctorId: string, date: string) {
    this.doctorService.getScheduleByDoctorId(doctorId, date, this.hospital.id)
      .subscribe(data => {
        this.doctorSchedules1 = data.data;
        if (this.doctorSchedules1.length > 0) {
          this.showScheduleType2 = false;
          this.showScheduleType1 = true;
          this.message1 = null;
        } else {
          this.message1 = {
            title: 'Data tidak ditemukan',
            description: ''
          };
        }
      });
  }

  getSchedulesByKeywords(specialityId: string, date: string, areaId?: string, hospitalId?: string) {
    this.doctorService.getScheduleByKeywords(specialityId, date, areaId, hospitalId)
      .subscribe(data => {
        this.doctorSchedules2 = data.data;
        if (this.doctorSchedules2.length > 0) {
          this.showScheduleType1 = false;
          this.showScheduleType2 = true;
          this.message1 = null;
        } else {
          this.message1 = {
            title: 'Data tidak ditemukan',
            description: ''
          };
        }
      });
  }

  async getLeaveHeader(keywords: any) {
    const year = moment().format('YYYY');
    const doctorId = keywords.doctor ? keywords.doctor.doctor_id : null;
    const areaId = keywords.area ? keywords.area.area_id : null;
    const hospitalId = !isEmpty(keywords.hospital) ? keywords.hospital.hospital_id : null;
    const specialityId = keywords.speciality ? keywords.speciality.speciality_id : null;
    this.leaves = await this.scheduleService.getLeaveHeader(
      year,
      hospitalId,
      doctorId,
      areaId,
      specialityId).toPromise().then(
        data => {
          return data.data;
        }
      );
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
    this.router.navigate(['/create-appointment'], {
      queryParams: {
        id: item.schedule_id,
        date: date
      }
    });
  }

  gotoCreateApp2(item: any, date: string) {
    const output = { ...item, date }
    this.opScheduleSelected.emit(output);
  }

  gotoCreateApp3(item: any, date: string) {
    this.router.navigate(['/create-appointment-271095'], {
      queryParams: {
        id: item.schedule_id,
        date: date
      }
    });
  }

}

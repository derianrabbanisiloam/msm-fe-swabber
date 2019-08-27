import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../../models/doctors/doctor';
import { leaveType } from '../../../variables/common.variable';
import { DoctorService } from '../../../services/doctor.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from '../widget-doctor-leave/ngb-date-fr-parser-formatter';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-widget-doctor-leave',
  templateUrl: './widget-doctor-leave.component.html',
  styleUrls: ['./widget-doctor-leave.component.css'],
  providers: [NgbDatepickerConfig, { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }],
})
export class WidgetDoctorLeaveComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  constructor(
    private doctorService: DoctorService,
    private modalService: NgbModal,
    config: NgbDatepickerConfig,
  ) { }

  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;

  public leaveType: any = leaveType;
  public dateOne: any;
  public todayYear: number;
  public todayMonth: number;
  public todayDay: number;
  public dateToday: string;
  public hospitalId: string = this.hospital.id;
  public userId: string = this.user.id;
  public doctors: Doctor[];
  public doctorSelectedOne: any;
  public doctorSelectedTwo: any;
  public fromToDate: any;
  public doctorIdSelectedOne: string;
  public doctorIdSelectedTwo: string;
  public myDateRangePickerOptions: IMyDrpOptions;
  public myDateRangePickerOptionsTwo: IMyDrpOptions;
  public model: any = {};
  public dummyMACAddress = 'B0-35-9F-F3-64-89';
  public dateTwo: any;
  public closeResult: string;
  public fromToPost: string;
  public fromToView: string;
  public today: any;
  public dateMoment: any;
  public fromDateRefresh: any;
  public toDateRefresh: any;
  public doctorRefresh: any;
  public leaves: string;
  public selectedEditLeave: any;
  public selectedDeleteLeave: any;
  public fromDateEdit: NgbDateStruct;
  public toDateEdit: NgbDateStruct;
  public noteEdit: string;
  public scheduleTypeIdEdit: string;
  public scheduleTypeEdit: string;
  public scheduleIdEdit: string;
  public selector = 0;
  public showSelected: boolean;
  public hideSelected: boolean;
  public flag = false;
  public toggoleShowHide = 'hidden';
  public tampungOne: any;
  public tampungTwo: any;
  public todayDateISO: any = moment().subtract(1, 'days').format('YYYY-MM-DD');
  public todayDateISO2: any = moment().format('YYYY-MM-DD');

  public postDoctorLeaveForm = new FormGroup({
    scheduleTypeId: new FormControl('scheduleTypeId', Validators.required),
    from_to_pl: new FormControl('from_to_pl', Validators.required),
    notes: new FormControl('notes'),
  });

  public getViewDoctorLeaveForm = new FormGroup({
    from_to_date: new FormControl('from_to_date', Validators.required),
    doctorId: new FormControl('doctor_id')
  });

  ngOnInit() {
    this.dateOne = this.todayDateISO2;
    this.getDoctors();
    this.getLeaveToday();

    this.dateMoment = this.todayDateISO;
    this.today = this.dateMoment.split('-');
    this.myDateRangePickerOptions = {
      dateFormat: 'dd/mm/yyyy',
      height: '27px',
      width: '240px',
      disableUntil: { year: this.today[0], month: this.today[1], day: this.today[2] }
    };

    this.myDateRangePickerOptionsTwo = {
      dateFormat: 'dd/mm/yyyy',
      height: '27px',
      width: '240px'
    };
  }

  getDoctors() {
    this.doctorService.getListDoctor(this.hospitalId)
      .subscribe(data => {
        this.doctors = data.data;
        this.flag = true;
      }, err => {
        this.doctors = [];
        this.flag = true;
      });
  }

  getLeaveToday() {
    this.doctorService.getViewDoctorLeave(this.hospitalId, this.dateOne, this.dateOne)
      .subscribe(data => {
        this.leaves = data.data;
        this.flag = false;
      }, err => {
        this.leaves = null;
        this.flag = false;
      });
  }

  searchDoctorOne(item) {
    this.doctorIdSelectedOne = item.doctor_id;
  }

  searchDoctorTwo(item) {
    this.doctorIdSelectedTwo = item.doctor_id;
  }

  postDoctorLeave(): void {
    this.postDoctorLeaveForm.controls.scheduleTypeId.setValue(this.postDoctorLeaveForm.controls.scheduleTypeId.value);
    this.postDoctorLeaveForm.controls.notes.setValue(this.postDoctorLeaveForm.controls.notes.value);

    let formData: any = {};
    formData = this.postDoctorLeaveForm.value;

    if (this.doctorIdSelectedOne === undefined || this.doctorIdSelectedOne === '' || this.doctorIdSelectedOne === null) {
      this.doctorIdSelectedOne = '';
    } else {
      formData.doctor_id = this.doctorIdSelectedOne;
      const fromDate = this.postDoctorLeaveForm.controls.from_to_pl.value.beginDate.year + '-' +
        this.postDoctorLeaveForm.controls.from_to_pl.value.beginDate.month + '-' +
        this.postDoctorLeaveForm.controls.from_to_pl.value.beginDate.day;
      const toDate = this.postDoctorLeaveForm.controls.from_to_pl.value.endDate.year + '-' +
        this.postDoctorLeaveForm.controls.from_to_pl.value.endDate.month + '-' +
        this.postDoctorLeaveForm.controls.from_to_pl.value.endDate.day;

      const modelFromDate = fromDate;
      const splitFromDate = modelFromDate.split('-');
      const yearSplit = splitFromDate[0];
      const monthSplit = splitFromDate[1].length === 1 ? '0' + splitFromDate[1] : splitFromDate[1];
      const daySplit = splitFromDate[2].length === 1 ? '0' + splitFromDate[2] : splitFromDate[2];
      const dateFromChange = yearSplit + '-' + monthSplit + '-' + daySplit;

      const modelToDate = toDate;
      const splitToDate = modelToDate.split('-');
      const yearSplitTwo = splitToDate[0];
      const monthSplitTwo = splitToDate[1].length === 1 ? '0' + splitToDate[1] : splitToDate[1];
      const daySplitTwo = splitToDate[2].length === 1 ? '0' + splitToDate[2] : splitToDate[2];
      const dateToChange = yearSplitTwo + '-' + monthSplitTwo + '-' + daySplitTwo;
      this.model.fromDate = dateFromChange;
      this.model.toDate = dateToChange;


      this.dateTwo = dateToChange;
      this.doctorRefresh = this.doctorIdSelectedOne;
      this.model.doctorId = formData.doctor_id;
      this.model.scheduleTypeId = this.postDoctorLeaveForm.controls.scheduleTypeId.value;
      this.model.notes = this.postDoctorLeaveForm.controls.notes.value ? this.postDoctorLeaveForm.controls.notes.value : '';
      this.model.userId = this.userId;
      this.model.source = this.dummyMACAddress;
      this.doctorService.postDoctorLeave(this.hospitalId, this.model)
        .subscribe(data => {
          Swal.fire({
            position: 'top-end',
            type: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500
          });
          this.postDoctorLeaveForm.reset();
          this.fromToPost = null;
          this.flag = false;
          this.tampungOne = null;
          this.tampungTwo = null;
          this.refreshDoctorLeaveByDoctorId();
          // this.leave_type_doctor = null;
          // this.leave_notes_doctor = null;
          // this.tampungOne = null;
          // this.tampungTwo = null;
          // this.flag = false;
        }, err => {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            timer: 1500
          });
        });
    }

  }

  getViewDoctorLeave(): void {
    this.tampungOne = this.getViewDoctorLeaveForm.controls.from_to_date.value.beginDate.day + '-' +
      this.getViewDoctorLeaveForm.controls.from_to_date.value.beginDate.month + '-' +
      this.getViewDoctorLeaveForm.controls.from_to_date.value.beginDate.year;
    this.tampungTwo = this.getViewDoctorLeaveForm.controls.from_to_date.value.endDate.day + '-' +
      this.getViewDoctorLeaveForm.controls.from_to_date.value.endDate.month + '-' +
      this.getViewDoctorLeaveForm.controls.from_to_date.value.endDate.year;

    this.model.fromDate = this.getViewDoctorLeaveForm.controls.from_to_date.value.beginDate.year + '-' +
      this.getViewDoctorLeaveForm.controls.from_to_date.value.beginDate.month + '-' +
      this.getViewDoctorLeaveForm.controls.from_to_date.value.beginDate.day;

    this.model.toDate = this.getViewDoctorLeaveForm.controls.from_to_date.value.endDate.year + '-' +
      this.getViewDoctorLeaveForm.controls.from_to_date.value.endDate.month + '-' +
      this.getViewDoctorLeaveForm.controls.from_to_date.value.endDate.day;

    if (this.doctorIdSelectedTwo === undefined || this.doctorIdSelectedTwo === '' || this.doctorIdSelectedTwo === null) {
      this.doctorIdSelectedTwo = '';
    }

    this.fromDateRefresh = this.model.fromDate;
    this.toDateRefresh = this.model.toDate;

    if (this.doctorIdSelectedTwo !== '') {
      this.doctorRefresh = this.doctorIdSelectedTwo;
      this.doctorService.getViewDoctorLeave(this.hospitalId, this.model.fromDate, this.model.toDate, this.doctorIdSelectedTwo)
        .subscribe(data => {
          this.leaves = data.data;
          this.fromToView = null;
          this.flag = false;
        }, err => {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            timer: 1500
          });
          this.fromToView = null;
          this.leaves = null;
          this.flag = false;
        });

    } else {
      this.doctorService.getViewDoctorLeave(this.hospitalId, this.model.fromDate, this.model.toDate)
        .subscribe(data => {
          this.doctorRefresh = null;
          this.leaves = data.data;
          this.fromToView = null;
          this.flag = false;
        }, err => {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            timer: 1500
          });
          this.fromToView = null;
          this.doctorRefresh = null;
          this.leaves = null;
          this.flag = false;
        });
    }
  }

  editDoctorLeaveModal(val, content) {
    let dateFixOne;
    let dateFixTwo;
    let dateOne;
    let dateTwo;
    let scheduleType;
    this.selectedEditLeave = val;
    dateFixOne = this.selectedEditLeave.from_date;
    dateFixTwo = this.selectedEditLeave.to_date;
    dateOne = dateFixOne.substr(0, 10);
    dateTwo = dateFixTwo.substr(0, 10);
    this.fromDateEdit = {
      year: parseInt(dateOne.split('-')[0], 10),
      month: parseInt(dateOne.split('-')[1], 10),
      day: parseInt(dateOne.split('-')[2], 10),
    };
    this.toDateEdit = {
      year: parseInt(dateTwo.split('-')[0], 10),
      month: parseInt(dateTwo.split('-')[1], 10),
      day: parseInt(dateTwo.split('-')[2], 10),
    };
    this.noteEdit = this.selectedEditLeave.notes;
    this.scheduleTypeIdEdit = this.selectedEditLeave.schedule_type_id;
    this.scheduleIdEdit = this.selectedEditLeave.schedule_id;

    switch (this.scheduleTypeIdEdit) {
      case '2':
        scheduleType = 'Annual Leave';
        break;

      case '3':
        scheduleType = 'Personal Matters';
        break;

      case '4':
        scheduleType = 'Maternity';
        break;

      case '5':
        scheduleType = 'Sick Leave';
        break;
    }
    this.scheduleTypeEdit = scheduleType;

    this.open(content);
  }


  deleteDoctorLeaveModal(val, content) {
    this.selectedDeleteLeave = val;
    this.open(content);
  }

  showError() {
    this.editDoctorLeave();
  }

  editDoctorLeave() {
    const modelFromDate = this.fromDateEdit.year + '-' + this.fromDateEdit.month + '-' + this.fromDateEdit.day;
    const splitFromDate = modelFromDate.split('-');
    const yearSplit = splitFromDate[0];
    const monthSplit = splitFromDate[1].length === 1 ? '0' + splitFromDate[1] : splitFromDate[1];
    const daySplit = splitFromDate[2].length === 1 ? '0' + splitFromDate[2] : splitFromDate[2];
    const dateFromChange = yearSplit + '-' + monthSplit + '-' + daySplit;

    const modelToDate = this.toDateEdit.year + '-' + this.toDateEdit.month + '-' + this.toDateEdit.day;
    const splitToDate = modelToDate.split('-');
    const yearSplitTwo = splitToDate[0];
    const monthSplitTwo = splitToDate[1].length === 1 ? '0' + splitToDate[1] : splitToDate[1];
    const daySplitTwo = splitToDate[2].length === 1 ? '0' + splitToDate[2] : splitToDate[2];
    const dateToChange = yearSplitTwo + '-' + monthSplitTwo + '-' + daySplitTwo;

    this.model.fromDate = dateFromChange;
    this.model.toDate = dateToChange;

    this.model.notes = this.noteEdit;
    this.model.userId = this.userId;
    this.model.source = this.dummyMACAddress;

    this.doctorService.editDoctorLeave(this.hospitalId, this.scheduleIdEdit, this.model)
      .subscribe(data => {
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500
        });
        if (this.doctorRefresh == null) {
          this.refreshDoctorLeave();
        } else {
          this.refreshDoctorLeaveByDoctorId();
        }
      }, err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          timer: 1500
        });
      });

  }

  deleteDoctorLeave() {
    const modal = {
      userId: this.userId,
      source: this.dummyMACAddress
    };
    this.doctorService.deleteDoctorLeave(this.hospitalId, this.selectedDeleteLeave.schedule_id, modal)
      .subscribe(data => {
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500
        });
        if (this.doctorRefresh == null) {
          this.refreshDoctorLeave();
        } else {
          this.refreshDoctorLeaveByDoctorId();
        }
      }, err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          timer: 1500
        });
      });
  }

  refreshDoctorLeaveByDoctorId() {
    this.doctorService.getViewDoctorLeave(this.hospitalId, this.dateOne, this.dateTwo, this.doctorRefresh)
      .subscribe(data => {
        this.leaves = data.data;
        this.showSelected = true;
        this.toggoleShowHide = 'visible';
        this.flag = false;
      }, err => {
        this.toggoleShowHide = 'hidden';
        this.showSelected = false;
        this.flag = false;
        this.leaves = null;
      });
  }

  refreshDoctorLeave() {
    if (this.fromDateRefresh === undefined || this.toDateRefresh === undefined) {
      this.doctorService.getViewDoctorLeave(this.hospitalId, this.dateOne, this.dateOne)
        .subscribe(data => {
          this.leaves = data.data;
          this.showSelected = true;
          this.toggoleShowHide = 'visible';
          this.fromToView = null;
          this.flag = false;
        }, error => {
          this.toggoleShowHide = 'hidden';
          this.fromToView = null;
          this.showSelected = false;
          this.leaves = null;
          this.flag = false;
        }
        );
    } else {
      this.doctorService.getViewDoctorLeave(this.hospitalId, this.fromDateRefresh, this.toDateRefresh)
        .subscribe(data => {
          this.leaves = data.data;
          this.showSelected = true;
          this.toggoleShowHide = 'visible';
          this.fromToView = null;
          this.flag = false;
        }, err => {
          this.toggoleShowHide = 'hidden';
          this.fromToView = null;
          this.showSelected = false;
          this.leaves = null;
          this.flag = false;
        }
        );
    }

  }

  open(content) {
    this.modalService.open(content).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  clear() {
    this.postDoctorLeaveForm.reset();
    this.flag = false;
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

  toggleSelector(event: any): void {
    event.stopPropagation();
    this.selector++;
  }

}

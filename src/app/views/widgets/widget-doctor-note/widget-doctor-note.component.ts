import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../../models/doctors/doctor';
import { DoctorNote } from '../../../models/doctors/doctor-note';
import { DoctorService } from '../../../services/doctor.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbCalendar, NgbDatepickerConfig, NgbDateParserFormatter, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from '../widget-doctor-leave/ngb-date-fr-parser-formatter';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';
import { sourceApps } from '../../../variables/common.variable'

@Component({
  selector: 'app-widget-doctor-note',
  templateUrl: './widget-doctor-note.component.html',
  styleUrls: ['./widget-doctor-note.component.css'],
  providers: [NgbDatepickerConfig, { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }],
})
export class WidgetDoctorNoteComponent implements OnInit {
  /* For Alert Message */
  public assetPath = environment.ASSET_PATH;
  constructor(
    private doctorService: DoctorService,
    private modalService: NgbModal,
    config: NgbDatepickerConfig,
    configTwo: NgbProgressbarConfig,
    calendar: NgbCalendar,
  ) {
    this.today = calendar.getToday();
    this.yesterday = this.todayDateISO.split('-');
    configTwo.max = 100;
    configTwo.striped = true;
    configTwo.animated = true;
    configTwo.type = 'success';
    configTwo.height = '20px';
  }

  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;

  public hospitalId: string = this.hospital.id;
  public userId: string = this.user.id;
  public dummyMACAddress = sourceApps;
  public selectedEditNote: any;
  public selectedDeleteNote: any;
  public fromDateEdit: NgbDateStruct;
  public toDateEdit: NgbDateStruct;
  public today: NgbDateStruct;
  public yesterday: any;
  public todayDateISO: any = moment().subtract(1, 'days').format('YYYY-MM-DD');
  public todayString: string;
  public todayStringTwo: string;
  public myDateRangePickerOptions: IMyDrpOptions;
  public myDateRangePickerOptionsTwo: IMyDrpOptions;
  public from_date_notes: NgbDateStruct;
  public to_date_notes: NgbDateStruct;
  public doctorIdSelectedOne: string;
  public doctorIdSelectedTwo: string;
  public doctorSelectedOne: any;
  public doctorSelectedTwo: any;
  public note: string;
  public doctors: Doctor[];
  public doctorNotes: DoctorNote[];
  public closeResult: string;
  public model: any = {};
  public modelEdit: any = {};
  public modelDelete: any = {};
  public doctorUid: string;
  public dfRefresh: string = null;
  public tfRefresh: string = null;
  public showLoadingTwo = false;
  public tampungOne: string;
  public tampungTwo: string;
  public from_to_view: string;
  public from_to_post: string;
  public selector = 0;

  /* For Alert Message */
  public _success = new Subject<string>();
  public _successTwo = new Subject<string>();
  public successMessage: string;
  public successMessageTwo: string;
  public _error = new Subject<string>();
  public errorMessage: string;
  public _errorConnection = new Subject<string>();
  public errorMessageConnection: string;
  public _printMsgWait = new Subject<string>();
  public printWaitMessage: string;

  public getViewDoctorNotesForm = new FormGroup({
    doctorId: new FormControl('doctorId'),
    from_to_date: new FormControl('from_to_date', Validators.required),
  });

  public postDoctorNotesForm = new FormGroup({
    note: new FormControl('', Validators.required),
    from_to_pn: new FormControl('', Validators.required),
  });

  public options = {
    position: ['top', 'right'],
    timeOut: 3000,
    lastOnBottom: true,
    clickToClose: true
  };

  ngOnInit() {
    this.myDateRangePickerOptions = {
      dateFormat: 'dd/mm/yyyy',
      height: '27px',
      width: '240px',
      disableUntil: { year: this.yesterday[0], month: this.yesterday[1], day: this.yesterday[2] }
    };

    this.myDateRangePickerOptionsTwo = {
      dateFormat: 'dd/mm/yyyy',
      height: '27px',
      width: '240px'
    };
    this.todayString = this.today.year + '-' + this.today.month + '-' + this.today.day;
    this.todayStringTwo = this.today.day + '-' + this.today.month + '-' + this.today.year;

    this.from_date_notes = null;
    this.to_date_notes = null;
    this.note = null;

    // Load doctor list
    this.doctorService.getListDoctor(this.hospitalId)
      .subscribe(data => {
        this.doctors = data.data;
      }, err => {
        this.doctors = [];
      });

    this.doctorService.getDoctorNotes(this.hospitalId, this.todayString, this.todayString)
      .subscribe(data => {
        this.doctorNotes = data.data;
        this.from_date_notes = null;
        this.to_date_notes = null;
      }, err => {
        this.doctorNotes = [];
      });
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  clear() {
    this.postDoctorNotesForm.reset();
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

  searchDoctorOne(item) {
    this.doctorIdSelectedOne = item.doctor_id;
  }

  searchDoctorTwo(item) {
    this.doctorIdSelectedTwo = item.doctor_id;
  }


  postDoctorNotes(): void {
    this.postDoctorNotesForm.controls.note.setValue(this.postDoctorNotesForm.controls.note.value);

    this.model.note = this.postDoctorNotesForm.controls.note.value;
    this.model.userId = this.userId;
    this.model.source = this.dummyMACAddress;

    this.model.doctorId = this.doctorIdSelectedTwo;
    this.doctorUid = this.doctorIdSelectedTwo;
    const fromDate = this.postDoctorNotesForm.controls.from_to_pn.value.beginDate.year + '-' +
      this.postDoctorNotesForm.controls.from_to_pn.value.beginDate.month + '-' +
      this.postDoctorNotesForm.controls.from_to_pn.value.beginDate.day;
    const toDate = this.postDoctorNotesForm.controls.from_to_pn.value.endDate.year + '-' +
      this.postDoctorNotesForm.controls.from_to_pn.value.endDate.month + '-' +
      this.postDoctorNotesForm.controls.from_to_pn.value.endDate.day;

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
    this.model.userId = this.userId;
    this.model.userName = this.user.fullname;
    this.model.source = this.dummyMACAddress;

    this.dfRefresh = this.model.fromDate;
    this.tfRefresh = this.model.toDate;

    this.doctorService.postDoctorNotes(this.hospitalId, this.model)
      .subscribe(data => {
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500
        });
        this.note = '';
        this.from_to_post = null;
        this.refreshNotes();
      }, err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          timer: 1500
        });
      });
  }

  getDoctorNotes(): void {
    this.showLoadingTwo = true;
    this.model.doctorId = this.doctorIdSelectedOne;

    this.model.fromDate = this.getViewDoctorNotesForm.controls.from_to_date.value.beginDate.year + '-' +
      this.getViewDoctorNotesForm.controls.from_to_date.value.beginDate.month + '-' +
      this.getViewDoctorNotesForm.controls.from_to_date.value.beginDate.day;
    this.model.toDate = this.getViewDoctorNotesForm.controls.from_to_date.value.endDate.year + '-' +
      this.getViewDoctorNotesForm.controls.from_to_date.value.endDate.month + '-' +
      this.getViewDoctorNotesForm.controls.from_to_date.value.endDate.day;

    this.dfRefresh = this.model.fromDate;
    this.tfRefresh = this.model.toDate;

    this.tampungOne = this.getViewDoctorNotesForm.controls.from_to_date.value.beginDate.day + '-' +
      this.getViewDoctorNotesForm.controls.from_to_date.value.beginDate.month + '-' +
      this.getViewDoctorNotesForm.controls.from_to_date.value.beginDate.year;
    this.tampungTwo = this.getViewDoctorNotesForm.controls.from_to_date.value.endDate.year + '-' +
      this.getViewDoctorNotesForm.controls.from_to_date.value.endDate.month + '-' +
      this.getViewDoctorNotesForm.controls.from_to_date.value.endDate.day;

    if (this.doctorIdSelectedOne != '') {
      this.doctorService.getDoctorNotes(this.hospitalId, this.model.fromDate, this.model.toDate, this.doctorIdSelectedOne)
        .subscribe(data => {
          this.doctorNotes = data.data;
          this.from_to_view = null;
          this.from_date_notes = null;
          this.to_date_notes = null;
          this.showLoadingTwo = false;
        }, err => {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            timer: 1500
          });
          this.doctorNotes = [];
          this.from_to_view = null;
          this.showLoadingTwo = false;
        });
    } else {
      this.doctorService.getDoctorNotes(this.hospitalId, this.model.fromDate, this.model.toDate)
        .subscribe(data => {
          this.doctorUid = '';
          this.doctorNotes = data.data;
          this.from_to_view = null;
          this.from_date_notes = null;
          this.to_date_notes = null;

          this.from_date_notes = null;
          this.to_date_notes = null;
          this.showLoadingTwo = false;
        }, err => {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            timer: 1500
          });
          this.doctorNotes = [];
          this.doctorUid = '';
          this.from_to_view = null;
          this.showLoadingTwo = false;
        });
    }

  }

  refreshNotes() {
    if (this.doctorUid == null || this.doctorUid == '') {
      if (this.dfRefresh == null || this.dfRefresh == '') {
        this.doctorService.getDoctorNotes(this.hospitalId, this.todayString, this.todayString)
          .subscribe(data => {
            this.doctorNotes = [];
            this.doctorNotes = data.data;
            this.from_date_notes = null;
            this.to_date_notes = null;
          }, err => {
            this.doctorNotes = [];
          });
      } else {
        this.doctorService.getDoctorNotes(this.hospitalId, this.dfRefresh, this.tfRefresh)
          .subscribe(data => {
            this.doctorNotes = [];
            this.doctorNotes = data.data;
          }, err => {
            this.doctorNotes = [];
          });
      }
    } else {
      this.doctorService.getDoctorNotes(this.hospitalId, this.dfRefresh, this.tfRefresh, this.doctorUid)
        .subscribe(data => {
          this.doctorNotes = [];
          this.doctorNotes = data.data;
        }, err => {
          this.doctorNotes = [];
        });
    }
  }

  showError() {
    if (this.selectedEditNote.doctor_id == '' || this.selectedEditNote.doctor_id == null) {
    } else if (!this.fromDateEdit) {
    } else if (!this.toDateEdit) {
    } else if (!this.selectedEditNote.note) {
    } else if (this.fromDateEdit.year > this.toDateEdit.year) {
      this._error.next(`To date Harus Lebih Besar / Sama Dengan from date`);
    } else if (this.fromDateEdit.month > this.toDateEdit.month) {
      this._error.next(`To date Harus Lebih Besar / Sama Dengan from date`);
    } else if (this.fromDateEdit.month == this.toDateEdit.month && this.fromDateEdit.day > this.toDateEdit.day) {
      this._error.next(`To date Harus Lebih Besar / Sama Dengan from date`);
    } else {
      this.editDoctorNotes();
    }
  }

  editDoctorNotes() {
    const noteId = this.selectedEditNote.doctor_note_id;
    this.modelEdit.note = this.selectedEditNote.note;
    const monthF = this.fromDateEdit.month < 10 ? 0 + '' + this.fromDateEdit.month : this.fromDateEdit.month;
    const monthT = this.toDateEdit.month < 10 ? 0 + '' + this.toDateEdit.month : this.toDateEdit.month;
    const dayF = this.fromDateEdit.day < 10 ? 0 + '' + this.fromDateEdit.day : this.fromDateEdit.day;
    const dayT = this.toDateEdit.day < 10 ? 0 + '' + this.toDateEdit.day : this.toDateEdit.day;

    this.modelEdit.fromDate = this.fromDateEdit.year + '-' + monthF + '-' + dayF;
    this.modelEdit.toDate = this.toDateEdit.year + '-' + monthT + '-' + dayT;
    this.modelEdit.userId = this.userId;
    this.modelEdit.userName = this.user.fullname;
    this.modelEdit.source = this.dummyMACAddress;

    this.doctorService.editDoctorNotes(this.hospitalId, noteId, this.modelEdit)
      .subscribe(data => {
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500
        });
        this.refreshNotes();
      }, err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          timer: 1500
        });
        this._error.next(`Failed`);
      });
  }

  editDoctorNotesModal(val, content) {
    let dateFixOne;
    let dateFixTwo;
    let dateOne;
    let dateTwo;
    this.selectedEditNote = val;
    dateFixOne = this.selectedEditNote.from_date;
    dateFixTwo = this.selectedEditNote.to_date;
    dateOne = dateFixOne.substr(0, 10);
    dateTwo = dateFixTwo.substr(0, 10);
    this.fromDateEdit = {
      year: parseInt(dateOne.split('-')[0]),
      month: parseInt(dateOne.split('-')[1]),
      day: parseInt(dateOne.split('-')[2])
    };
    this.toDateEdit = {
      year: parseInt(dateTwo.split('-')[0]),
      month: parseInt(dateTwo.split('-')[1]),
      day: parseInt(dateTwo.split('-')[2])
    };

    this.open(content);
  }

  deleteDoctorNotesModal(val, content) {
    this.selectedDeleteNote = val;
    this.open(content);
  }

  deleteDoctorNotes() {
    const modal = {
      userId: this.userId,
      source: this.dummyMACAddress
    };
    this.doctorService.deleteDoctorNotes(this.hospitalId, this.selectedDeleteNote.doctor_note_id, modal)
      .subscribe(data => {
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500
        });
        this.refreshNotes();
      }, err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          timer: 1500
        });
        this._error.next(`Failed`);
      });
  }

  clearNgModelDate(): void {
    this.model = null;
  }

  toggleSelector(event: any): void {
    event.stopPropagation();
    this.selector++;
  }

}

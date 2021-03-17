import * as moment from 'moment';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { ScheduleService } from '../../../services/schedule.service';
import { DoctorService } from '../../../services/doctor.service';
import { DoctorNote } from '../../../models/doctors/doctor-note';
import { DoctorProfile } from '../../../models/doctors/doctor-profile';
import { ScheduleBlock } from '../../../models/schedules/schedule-block';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import {
  doctorType,
} from '../../../variables/common.variable';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-widget-create-app-vaccine',
  templateUrl: './widget-create-app-vaccine.component.html',
  styleUrls: ['./widget-create-app-vaccine.component.css']
})
export class WidgetCreateAppVaccineComponent implements OnInit {
  @Input() appointmentPayloadInput: any;
  @Output() opSlotSelected = new EventEmitter<any>();
  public patientDetail: any;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public assetPath = environment.ASSET_PATH;
  public appointments: any;
  public appList: any = [];
  public schLength: number = 0;
  public appListWaiting: any = [];
  public appointmentPayload: any = {};
  public schedule: any = null;
  public appDateDisplay: any;
  public table1Header: any = [];
  public table2Header: any = [];
  public doctorType: any = doctorType;
  public doctorProfile: DoctorProfile = new DoctorProfile;
  public doctorNotes: DoctorNote[];
  public scheduleBlocks: ScheduleBlock[];
  public modalConfig: any = {};
  public alerts: Alert[] = [];
  public isOriginal: boolean = true;
  public closeResult: string;
  public keyword: any;
  public isError: boolean = false;
  public isOpen: boolean = true;
  public slotList: any = [];

  public scheduleTemp: string;
  public doctorName: string;
  public hospitalName: string;
  public selectedApp: any;
  public selectedAdm: any;
  public doctorList: any;
  public mask_birth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public email: string = '';
  public emailTemp: string = '';
  public notes: string = '';
  public checkUpName: string;
  public isSubmitting: boolean = false;
  public checkEmail = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
  public doctorId: any = null;
  public dateToday: any = moment().format('YYYY-MM-DD');
  public dateTomorrow: any = moment().add(1, 'd').format('YYYY-MM-DD');
  public addAppPayload: any;
  public item: any;
  public confirmClose: any;
  public disableBut: boolean = false;
  public isDriveThru: any = null;
  public scheduleIdForScroll: any = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appointmentService: AppointmentService,
    private scheduleService: ScheduleService,
    private doctorService: DoctorService,
    private modalService: NgbModal,
    private alertService: AlertService,
    modalSetting: NgbModalConfig,
  ) {
    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
  }

  async ngOnInit() {
    await this.setTableHeader();
    await this.getCollectionAlert();
    await this.getQueryParams();
    await this.enableWalkInChecker();
    await this.getSchedule();
    await this.getDoctorNotes();
    await this.getAppointmentList();
    await this.getSlotTime();
    await this.dataProcessing();
    await this.scrollAuto();
    await this.emitRescheduleApp();
  }

  async scrollAuto() {
    let value = this.scheduleIdForScroll;
    if(this.schedule && this.appList.length > 0) {
      if(value) {document.getElementById(value).scrollIntoView({ behavior: 'smooth' });}
    }
  }

  async ngOnChanges() {
    await this.setTableHeader();
    await this.getCollectionAlert();
    await this.getQueryParams();
    await this.enableWalkInChecker();
    await this.getSchedule();
    await this.getDoctorNotes();
    await this.getAppointmentList();
    await this.getSlotTime();
    await this.dataProcessing();
    await this.emitRescheduleApp();
  }

  emitRescheduleApp() {
    this.appointmentService.rescheduleAppSource$.subscribe(
      result => {
        if (result === true) {
          this.alertService.success('Reschedule appointment berhasil', false, 3000);
        } else {
          this.alertService.error(result, false, 3000);
        }
      }
    );
  }

  async getDoctorNotes() {
    const hospitalId = this.hospital.id;
    const checkUpId = this.appointmentPayload.checkUpId;
    const fromDate = this.appointmentPayload.date;
    const toDate = fromDate;
    await this.doctorService.getDoctorNotesCovid(hospitalId, fromDate, toDate, checkUpId).toPromise().then(
      data => {
        if (data.data.length === 0) {
          this.doctorNotes = null;
        } else {
          this.doctorNotes = data.data;
        }
      }
    );
  }

  async enableWalkInChecker() {
    //to enable or disable button checkin and slot walkin 
    const appointmentDate = this.appointmentPayload.date;
    this.isOpen = this.dateToday < appointmentDate ? false : true;
    if(appointmentDate > this.dateToday) {
      this.isOpen = this.dateTomorrow < appointmentDate ? false : true;
    }
  }

  getQueryParams() {
    if (this.appointmentPayloadInput) { //from modal reschedule appointment
      this.appointmentPayload.checkUpId = this.appointmentPayloadInput.checkupId;
      this.appointmentPayload.date = this.appointmentPayloadInput.appointmentDate;
      this.hospitalName = this.hospital.name;
      this.checkUpName = this.appointmentPayloadInput.checkupName;
      this.scheduleIdForScroll = this.appointmentPayloadInput.checkUpScheduleId;
      this.isOriginal = false;
    }
    if (!this.appointmentPayload.checkUpId && !this.appointmentPayload.date && !this.appointmentPayload.day) {
      this.router.navigate(['/doctor-schedule']);
    }
    this.appDateDisplay = moment(this.appointmentPayload.date).format('dddd, DD MMMM YYYY');
  }

  setTableHeader() {
    this.table1Header = ['Time', 'No.', 'Patient Name', 'Date of Birth', 'Local MR No', 'Phone No', 'Queue No',
      'Note', 'Modified By', 'Action'];
    this.table2Header = ['Time', 'No.', 'Patient Name', 'Date of Birth', 'Local MR No', 'Phone No', 'Queue No', 'Note',
      'Modified By', 'Action'];
  }

  async dataProcessing() {
    //this function use to make list appointment base on slot time
    this.appList = [];

    const hospitalId = this.hospital.id;

    //this param using in waiting list and FCFS
    let no;
    this.schLength = this.schedule.length;
    for (let k = 0, { length } = this.schedule; k < length; k += 1) {
      no = 0;
      const fromTime = this.schedule[k].from_time;
      const toTime = this.schedule[k].to_time;
      let appTime = `${fromTime} - ${toTime}`;
      this.appList.push(
        {
          checkup_schedule_id: this.schedule[k].checkup_schedule_id,
          appointment: []
        }
      )

      for (let i = 0, { length } = this.appointments; i < length; i++) {
        if (this.appList[k].checkup_schedule_id === this.appointments[i].checkup_schedule_id) {
          no += 1;
          this.appList[k].appointment.push({
            no: no,
            hospital_id: hospitalId,
            appointment_range_time: appTime,
            appointment_from_time: fromTime,
            appointment_to_time: toTime,
            appointment_id: this.appointments[i].appointment_id,
            admission_hope_id: this.appointments[i].admission_hope_id,
            admission_no: this.appointments[i].admission_hope_id,
            patient_name: this.appointments[i].contact_name,
            contact_id: this.appointments[i].contact_id,
            date_of_birth: moment(this.appointments[i].birth_date).format('DD-MM-YYYY'),
            local_mr_no: this.appointments[i].medical_record_number,
            phone_no: this.appointments[i].phone_number_1,
            queue_no: this.appointments[i].queue_number ? this.appointments[i].queue_number : null,
            patient_visit_number: this.appointments[i].patient_visit_number ? this.appointments[i].patient_visit_number : null,
            modified_name: this.appointments[i].modified_name,
            modified_by: this.appointments[i].modified_by,
            is_can_create: false,
            is_can_cancel: true,
            is_walkin: false,
            checkup_schedule_id: this.schedule[k].checkup_schedule_id,
            channel_id: this.appointments[i].channel_id ? this.appointments[i].channel_id : null,
            appointment_status_id: this.appointments[i].appointment_status_id ? this.appointments[i].appointment_status_id : null,
            patient_hope_id: this.appointments[i].patient_hope_id ? this.appointments[i].patient_hope_id : null,
            patient_organization_id: this.appointments[i].patient_organization_id ? this.appointments[i].patient_organization_id : null,
            payment_status_id: this.appointments[i].payment_status_id ? this.appointments[i].payment_status_id : ''
          });
        }
      }

      const appListLength = this.appList[k].appointment.length;
      no += 1;
      this.appList[k].appointment.push({
        no: no,
        hospital_id: hospitalId,
        appointment_range_time: appListLength > 0 ? '' : appTime,
        appointment_from_time: fromTime,
        appointment_to_time: toTime,
        appointment_id: null,
        admission_no: null,
        admission_hope_id: null,
        patient_name: null,
        contact_id: null,
        date_of_birth: null,
        local_mr_no: null,
        phone_no: null,
        queue_no: null,
        modified_name: '',
        modified_by: null,
        is_can_create: true,
        is_can_cancel: false,
        is_walkin: false,
        checkup_schedule_id: this.schedule[k].checkup_schedule_id,
        channel_id: null,
        patient_visit_number: null,
        appointment_status_id: null,
        patient_hope_id: null,
        patient_organization_id: null,
        payment_status_id: ''
      });
    }

  }

  async getAppointmentList() {
    const checkUpId = this.appointmentPayload.checkUpId;
    const hospitalId = this.hospital.id;
    const date = this.appointmentPayload.date;
    const isDriveThru = this.isDriveThru !== null ? this.isDriveThru : null;
    this.appointments = [];
    await this.appointmentService.getAppointmentByDayCovid(hospitalId, checkUpId, date, isDriveThru).toPromise().then(
      data => {
        this.appointments = data.data;
      }
    );
  }

  async getSlotTime() {
    //get time slot
    const date = this.appointmentPayload.date;
    const hospitalId = this.hospital.id;
    const isDriveThru = this.isDriveThru !== null ? this.isDriveThru : null;
    await this.scheduleService.getTimeSlotCovid(hospitalId, this.appointmentPayload.checkUpId, date, isDriveThru).toPromise().then(
      data => {
        this.slotList = data.data;
      }
    );
  }

  async getSchedule() {
    const checkUpId = this.appointmentPayload.checkUpId;
    const date = this.appointmentPayload.date;
    const isDriveThru = this.isDriveThru !== null ? this.isDriveThru : null;
    await this.scheduleService.getCheckUpSchedule(this.hospital.id, checkUpId, date, isDriveThru).toPromise().then(
      data => {
        this.schedule = data.data;
        this.schedule.map(x => {
          x.from_time = x.from_time.substr(0, 5);
          x.to_time = x.to_time.substr(0, 5);
        });
      }
    );
  }

  filterizePhoneNumber(phoneNumber: string) {
    phoneNumber = phoneNumber.replace(/_/gi, '');
    return phoneNumber;
  }

  public reschCurrentIdx: any;
  async openCreateAppModal2(item: any) {
    const fromTime = item.appointment_from_time ? item.appointment_from_time : item.schedule_from_time;
    const toTime = item.appointment_to_time ? item.appointment_to_time : item.schedule_to_time;
    const data = {
      checkup_schedule_id: item.checkup_schedule_id,
      appointment_date: this.appointmentPayloadInput.appointmentDate,
      appointment_from_time: fromTime,
      appointment_to_time: toTime,
      patient_name: this.appointmentPayloadInput.name,
      hospital_id: item.hospital_id,
      appointment_no: item.appointment_no,
    };

    let idx;
    idx = this.reschCurrentIdx;
    for (let k = 0, { length } = this.schedule; k < length; k += 1) {
      if (this.schedule[k].checkup_schedule_id === this.scheduleTemp) {
        if (idx) { //delete slot name when do move slot
          if (idx.is_waiting_list) {
            this.appListWaiting[k].appointment.map(x => {
              if (x.no === idx.no) {
                x.patient_name = null;
                x.is_can_create = true;
              }
            });
          } else {
            if (this.schedule[k].doctor_type_id === '1') { //first come first serve
              this.appList[k].appointment.map(x => {
                if (x.no === idx.no) {
                  x.patient_name = null;
                  x.is_can_create = true;
                }
              });
            } else {
              this.appList[k].appointment[idx.no - 1].patient_name = null;
              this.appList[k].appointment[idx.no - 1].is_can_create = true;
            }
          }
        }
      }
    }

    idx = item;
    this.reschCurrentIdx = idx;
    for (let k = 0, { length } = this.schedule; k < length; k += 1) {
      if (this.schedule[k].checkup_schedule_id === idx.checkup_schedule_id) {
        if (idx.is_waiting_list) { //take slot with name in waiting list
          this.scheduleTemp = idx.checkup_schedule_id;
          this.appListWaiting[k].appointment.map(x => {
            if (x.no === idx.no) {
              x.patient_name = this.appointmentPayloadInput.name;
              x.is_can_create = false;
            }
          });
        } else { //take slot with name
          this.scheduleTemp = idx.checkup_schedule_id;
          if (this.schedule[k].doctor_type_id === '1') {  //first come first serve
            this.appList[k].appointment.map(x => {
              if (x.no === idx.no) {
                x.patient_name = this.appointmentPayloadInput.name;
                x.is_can_create = false;
              }
            });
          } else {
            this.appList[k].appointment[idx.no - 1].patient_name = this.appointmentPayloadInput.name;
            this.appList[k].appointment[idx.no - 1].is_can_create = false;
          }
        }
      }
    }

    this.opSlotSelected.emit(data);
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

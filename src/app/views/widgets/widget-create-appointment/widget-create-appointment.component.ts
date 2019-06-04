import * as moment from 'moment';
import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { ScheduleService } from '../../../services/schedule.service';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentMini } from '../../../models/appointments/appointment-mini';
import { Schedule } from '../../../models/schedules/schedule';
import { DoctorNote } from '../../../models/doctors/doctor-note';
import { DoctorProfile } from '../../../models/doctors/doctor-profile';
import { ScheduleBlock } from '../../../models/schedules/schedule-block';
import { doctorType } from '../../../variables/common.variable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCancelAppointmentComponent } from '../modal-cancel-appointment/modal-cancel-appointment.component'
import { ModalCreateAppointmentComponent } from '../modal-create-appointment/modal-create-appointment.component';
import { ModalScheduleBlockComponent } from '../../widgets/modal-schedule-block/modal-schedule-block.component';
import { appointmentPayload as appPayload } from '../../../payloads/appointment.payload';
import { reserveSlotAppPayload as reserveSlotPayload } from '../../../payloads/reserve-slot.payload';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { sourceApps } from '../../../variables/common.variable';

@Component({
  selector: 'app-widget-create-appointment',
  templateUrl: './widget-create-appointment.component.html',
  styleUrls: ['./widget-create-appointment.component.css'],
})
export class WidgetCreateAppointmentComponent implements OnInit {
  @Input() appointmentPayloadInput: appPayload;
  @Output() opSlotSelected = new EventEmitter<any>();
  public key: any = JSON.parse(localStorage.getItem('key'));
  
  public appointments: AppointmentMini[];
  public appList: any = [];
  public appListWaiting: any = [];
  public appointmentPayload: appPayload = new appPayload;
  public schedule: Schedule = new Schedule;
  public appDateDisplay: any;
  public table1Header: any = [];
  public table2Header: any = [];
  public doctorType: any = doctorType;
  public doctorProfile: DoctorProfile = new DoctorProfile;
  public doctorNotes: DoctorNote[];
  public scheduleBlocks: ScheduleBlock[];
  public modalConfig: any = {};
  public alerts: Alert[] = [];
  private userId: string = this.key.user.id;
  private source: string = sourceApps;
  public isOriginal: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appointmentService: AppointmentService,
    private scheduleService: ScheduleService,
    private doctorService: DoctorService,
    private modalService: NgbModal,
    private alertService: AlertService,
  ) { }

  async ngOnInit() {
    await this.getQueryParams();
    await this.getSchedule();
    await this.getDoctorProfile();
    await this.getDoctorNotes();
    await this.getScheduleBlock();
    await this.getAppointmentList();
    await this.prepareTimeSlot();
    await this.prepareAppList();
    this.setTableHeader();
    this.emitCreateApp();
    this.emitCancelApp();
    this.emitScheduleBlock();
    this.getCollectionAlert();
  }

  async ngOnChanges() {
    await this.getQueryParams();
    await this.getSchedule();
    await this.getDoctorProfile();
    await this.getDoctorNotes();
    await this.getScheduleBlock();
    await this.getAppointmentList();
    await this.prepareTimeSlot();
    await this.prepareAppList();
    this.setTableHeader();
    this.emitCreateApp();
    this.emitCancelApp();
    this.emitScheduleBlock();
    this.getCollectionAlert();
  }

  getQueryParams() {
    if (this.appointmentPayloadInput) {
      this.appointmentPayload.scheduleId = this.appointmentPayloadInput.scheduleId;
      this.appointmentPayload.appointmentDate = this.appointmentPayloadInput.appointmentDate;
      this.isOriginal = false;
    } else {
      this.appointmentPayload.scheduleId = this.activatedRoute.snapshot.queryParamMap.get('id');
      this.appointmentPayload.appointmentDate = this.activatedRoute.snapshot.queryParamMap.get('date');
    }
    if (!this.appointmentPayload.scheduleId && !this.appointmentPayload.appointmentDate) {
      this.router.navigate(['/doctor-schedule']);
    }
    this.appDateDisplay = moment(this.appointmentPayload.appointmentDate).format('dddd, DD MMMM YYYY');
  }

  setTableHeader() {
    this.table1Header = ['Time', 'No.', 'Patient Name', 'Date of Birth', 'Local MR No', 'Phone No', 'Queue No',
      'Note', 'Modified By', 'Action'];
    this.table2Header = ['Time', 'No.', 'Patient Name', 'Date of Birth', 'Local MR No', 'Phone No', 'Queue No', 'Note', 
      'Modified By', 'Action'];
  }

  async prepareTimeSlot() {
    this.appList = [];
    this.appListWaiting = [];
    const hospitalId = this.schedule.hospital_id;
    const doctorId = this.schedule.doctor_id;
    const date = moment().format('YYYY-MM-DD');
    const diff = moment(`${date} ${this.schedule.to_time}`).unix() - 
                  moment(`${date} ${this.schedule.from_time}`).unix();
    const diffMinutes = Math.round(diff / 60);
    const { quota } = this.doctorProfile;
    const duration = Math.round(60 / quota);
    const slotLength = Math.round(diffMinutes / duration);
    const docType = this.doctorProfile.doctor_type_name;
    let no = 0;
    let fromTime; 
    let toTime;
    let appTime;
    let ftInit = this.schedule.from_time;
    let ttInit = this.schedule.to_time;
    appTime = `${ftInit} - ${ttInit}`;
    fromTime = ftInit;
    toTime = ttInit;
    let fAdd = 0;
    let tAdd = 0;
    if (docType === this.doctorType.FIX_APPOINTMENT || docType === this.doctorType.HOURLY_APPOINTMENT) {
      for (let i=0; i<slotLength; i++) {
        no += 1;
        if (docType === this.doctorType.FIX_APPOINTMENT) {
          fAdd = i * duration;
          tAdd = (i * duration) + duration;
          fromTime = moment(`${date} ${ftInit}`).add(fAdd, 'minute').format('HH:mm');
          toTime = moment(`${date} ${ftInit}`).add(tAdd, 'minute').format('HH:mm');
          appTime = `${fromTime} - ${toTime}`;
        } else if (docType === this.doctorType.HOURLY_APPOINTMENT) {
          if (i % Number(quota) === 0) {
            tAdd = fAdd + 60;
            fromTime = moment(`${date} ${ftInit}`).add(fAdd, 'minute').format('HH:mm');
            toTime = moment(`${date} ${ftInit}`).add(tAdd, 'minute').format('HH:mm');
            fAdd = tAdd;
            appTime = `${fromTime} - ${toTime}`;
          } else {
            appTime = '';
          }
        }
        this.appList.push({
          no: no,
          hospital_id: hospitalId,
          doctor_id: doctorId,
          appointment_range_time: appTime,
          appointment_from_time: fromTime,
          appointment_to_time: toTime,
          appointment_id: null,
          appointment_no: i,
          patient_name: null,
          date_of_birth: null,
          local_mr_no: null,
          phone_no: null,
          queue_no: null,
          note: null,
          modified_by: null,
          is_waiting_list: false,
          is_can_create: true,
          is_can_cancel: false,
          is_blocked: false,
        });
      }
    } else if (docType === this.doctorType.FCFS) {
      for (let i=0, n=this.appointments.length; i<n; i++) {
        this.appList.push({
          no: no + 1,
          hospital_id: hospitalId,
          doctor_id: doctorId,
          appointment_range_time: appTime,
          appointment_from_time: fromTime,
          appointment_to_time: toTime,
          appointment_id: null,
          appointment_no: i,
          patient_name: null,
          date_of_birth: null,
          local_mr_no: null,
          phone_no: null,
          queue_no: null,
          note: null,
          modified_by: null,
          is_waiting_list: false,
          is_can_create: true,
          is_can_cancel: false,
          is_blocked: false,
        });
      }
      const appListLength = this.appList.length;
      this.appList.push({
        no: appListLength + 1,
        hospital_id: hospitalId,
        doctor_id: doctorId,
        appointment_range_time: appListLength > 0 ? '' : appTime,
        appointment_from_time: fromTime,
        appointment_to_time: toTime,
        appointment_id: null,
        appointment_no: appListLength,
        patient_name: null,
        date_of_birth: null,
        local_mr_no: null,
        phone_no: null,
        queue_no: null,
        note: null,
        modified_by: null,
        is_waiting_list: false,
        is_can_create: true,
        is_can_cancel: false,
        is_blocked: false,
      });
    }
  }

  prepareAppList() {
    /** Appointment non waiting list  */
    let appTimeCompare;
    let blockTimeStart;
    let blockTimeEnd;
    const appointmentDate = this.appointmentPayload.appointmentDate;
    for(let i=0, length=this.appList.length; i<length; i++) {
      this.appointments.map(x => {
        if (Number(x.appointment_no) === i && x.is_waiting_list === false) {
          this.appList[i].appointment_id = x.appointment_id;
          this.appList[i].appointment_no = x.appointment_no;
          this.appList[i].patient_name = x.patient_name;
          this.appList[i].date_of_birth = moment(x.patient_birth).format('DD-MM-YYYY');
          this.appList[i].local_mr_no = x.medical_record_number;
          this.appList[i].phone_no = x.patient_phone_number;
          this.appList[i].queue_no = x.queue_number;
          this.appList[i].note = x.note;
          this.appList[i].modified_by = x.modified_by;
          this.appList[i].is_waiting_list = x.is_waiting_list;
          this.appList[i].is_can_create = false;
          this.appList[i].is_can_cancel = true;
        }
      });
      appTimeCompare = moment(`${appointmentDate} ${this.appList[i].appointment_from_time}`);
      this.scheduleBlocks.map(x => {
        blockTimeStart = moment(`${appointmentDate} ${x.from_time}`);
        blockTimeEnd = moment(`${appointmentDate} ${x.to_time}`);
        console.log(x.from_time, x.to_time, appointmentDate, this.appList[i].appointment_id);
        if (appTimeCompare >= blockTimeStart && appTimeCompare <= blockTimeEnd) {
          this.appList[i].is_blocked = true;
          this.appList[i].is_can_create = false;
          this.appList[i].is_can_cancel = false;
        }
      });
    }
    /** Appointment waiting list */
    let no = 0;
    const fromTime = this.schedule.from_time;
    const toTime = this.schedule.to_time;
    let appTime;
    appTime = `${fromTime} - ${toTime}`;
    let isBlockWaitingList = false;
    this.scheduleBlocks.map(x => {
      if (x.is_include_waiting_list === true) isBlockWaitingList = true;
    });
    this.appointments.map(x => {
      if (x.is_waiting_list === true) {
        no += 1;
        appTime = no === 1 ? appTime : '';
        this.appListWaiting.push({
          no: no,
          appointment_range_time: appTime,
          appointment_no: x.appointment_no,
          appointment_id: x.appointment_id,
          patient_name: x.patient_name,
          date_of_birth: moment(x.patient_birth).format('DD-MM-YYYY'),
          local_mr_no: x.medical_record_number,
          phone_no: x.patient_phone_number,
          queue_no: x.queue_number,
          note: x.note,
          modified_by: x.modified_by,
          is_waiting_list: x.is_waiting_list,
          is_can_create: false,
          is_can_cancel: isBlockWaitingList === false ? true : false,
          is_blocked: isBlockWaitingList,
        });
      }
    });
    const nextWlNo = Number(this.appList.length) + Number(this.appListWaiting.length);
    this.appListWaiting.push({
      no: no + 1,
      appointment_range_time: this.appListWaiting.length > 0 ? '' : appTime,
      appointment_no: nextWlNo,
      appointment_id: null,
      patient_name: null,
      date_of_birth: null,
      local_mr_no: null,
      phone_no: null,
      queue_no: null,
      note: null,
      modified_by: null,
      is_waiting_list: true,
      is_can_create: isBlockWaitingList === false ? true : false,
      is_can_cancel: false,
      is_blocked: isBlockWaitingList,
    });
  }

  async getAppointmentList() {
    const scheduleId = this.appointmentPayload.scheduleId;
    const date = this.appointmentPayload.appointmentDate;
    const sortBy = 'appointment_no';
    const orderBy = 'ASC';
    await this.appointmentService.getAppointmentByScheduleId(scheduleId, date, sortBy, orderBy).toPromise().then(
      data => {
        this.appointments = data.data;
      }
    );
  }

  async getDoctorProfile() {
    const hospitalId = this.schedule.hospital_id;
    const doctorId = this.schedule.doctor_id;
    const date = this.appointmentPayload.appointmentDate;
    await this.doctorService.getDoctorProfile(hospitalId, doctorId, date).toPromise().then(
      data => {
        this.doctorProfile = data.data[0];
      }
    );
  }

  async getDoctorNotes() {
    const hospitalId = this.schedule.hospital_id;
    const doctorId = this.schedule.doctor_id;
    const fromDate = this.appointmentPayload.appointmentDate;
    const toDate = fromDate;
    await this.doctorService.getDoctorNotes(hospitalId, fromDate, toDate, doctorId).toPromise().then(
      data => {
        this.doctorNotes = data.data;
      }
    );
  }

  async getSchedule() {
    const scheduleId = this.appointmentPayload.scheduleId;
    await this.scheduleService.scheduleDetail(scheduleId).toPromise().then(
      data => {
        this.schedule = data.data;        
        this.schedule.from_time = this.schedule.from_time.substr(0,5);
        this.schedule.to_time = this.schedule.to_time.substr(0,5);
      }
    );
  }

  confirmCancelAppointment(appointmentId: string) {
    const modalRef = this.modalService.open(ModalCancelAppointmentComponent);
    modalRef.componentInstance.appointmentId = appointmentId;
  }

  async openCreateAppModal(item: any) {
    console.log("=======")
    await this.reserveSlotApp(item);
    const canReserved = await this.getReservedSlot(item);
    const data = {
      schedule_id: this.appointmentPayload.scheduleId,
      appointment_date: this.appointmentPayload.appointmentDate,
      appointment_from_time: this.schedule.from_time,
      appointment_to_time: this.schedule.to_time,
      hospital_id: this.schedule.hospital_id,
      doctor_id: this.schedule.doctor_id,
      appointment_no: item.appointment_no,
      is_waiting_list: item.is_waiting_list,
      can_reserved: canReserved
    };
    const modalRef = this.modalService.open(ModalCreateAppointmentComponent);
    modalRef.componentInstance.appointmentInfo = data;
  }

  public reschCurrentIdx: any;
  async openCreateAppModal2(item: any) {
    await this.reserveSlotApp(item);
    const canReserved = await this.getReservedSlot(item);
    const data = {
      schedule_id: this.appointmentPayload.scheduleId,
      appointment_date: this.appointmentPayload.appointmentDate,
      appointment_from_time: this.schedule.from_time,
      appointment_to_time: this.schedule.to_time,
      hospital_id: this.schedule.hospital_id,
      doctor_id: this.schedule.doctor_id,
      appointment_no: item.appointment_no,
      is_waiting_list: item.is_waiting_list,
      can_reserved: canReserved
    };
    let idx = this.reschCurrentIdx;
    if (idx) {
      if (idx.is_waiting_list) {
        this.appListWaiting.map( x => {
          if (x.appointment_no === idx.appointment_no) {
            x.patient_name = null;
            x.is_can_create = true;  
          }
        });
      } else {
        this.appList[idx.appointment_no].patient_name = null;
        this.appList[idx.appointment_no].is_can_create = true;
      }
    }
    idx = item;
    this.reschCurrentIdx = idx;
    if (idx.is_waiting_list) {
      this.appListWaiting.map( x => {
        if (x.appointment_no === idx.appointment_no) {
          x.patient_name = this.appointmentPayloadInput.name;
          x.is_can_create = false;  
        }
      });
    } else {
      this.appList[idx.appointment_no].patient_name = this.appointmentPayloadInput.name;
      this.appList[idx.appointment_no].is_can_create = false;
    }
    this.opSlotSelected.emit(data);
  }

  async reserveSlotApp(app: any) {
    const payload: reserveSlotPayload = {
      scheduleId: this.appointmentPayload.scheduleId,
      appointmentDate: this.appointmentPayload.appointmentDate,
      appointmentNo: app.appointment_no,
      userId: this.userId,
      source: this.source,
    };
    await this.appointmentService.reserveSlotApp(payload).toPromise().then(
      data => {
        console.log(data, 'Slot reserved');
        return data.data;
      }
    );
  }

  async getReservedSlot(app: any) {
    const scheduleId = this.appointmentPayload.scheduleId;
    const appointmentDate = this.appointmentPayload.appointmentDate;
    const appointmentNo = app.appointment_no;
    const userId = this.userId;
    const result = await this.appointmentService.getReservedSlotApp(
      scheduleId,
      appointmentDate,
      appointmentNo,
      userId
    ).toPromise().then(
      data => {
        return data.data;
      }
    );
    return result;
  }

  prevPage() {
    window.history.back();
  }

  openScheduleBlockModal() {
    const params = {
      scheduleId: this.appointmentPayload.scheduleId,
      date: this.appointmentPayload.appointmentDate
    };
    const modalRef = this.modalService.open(ModalScheduleBlockComponent, {windowClass: 'cc_modal_block'});
    modalRef.componentInstance.inputedParams = params;
  }

  async getScheduleBlock() {
    const { scheduleId, appointmentDate } = this.appointmentPayload;
    await this.scheduleService.getScheduleBlock(scheduleId, appointmentDate).toPromise().then(
      data => {
        this.scheduleBlocks = data.data;
        this.scheduleBlocks.map(x => {
          x.from_time = x.from_time.substr(0,5);
          x.to_time = x.to_time.substr(0,5);
        });
      }
    );
  }

  emitCreateApp() {
    this.appointmentService.createAppSource$.subscribe(
      async () => {
        await this.getAppointmentList();
        await this.prepareTimeSlot();
        await this.prepareAppList();
      }
    );
  }

  emitCancelApp() {
    this.appointmentService.cancelAppSource$.subscribe(
      async () => {
        await this.getAppointmentList();
        await this.prepareTimeSlot();
        await this.prepareAppList();
      }
    );
  }

  emitScheduleBlock() {
    this.scheduleService.scheduleBlockSource$.subscribe(
      async () => {
        await this.getScheduleBlock();
        await this.getAppointmentList();
        await this.prepareTimeSlot();
        await this.prepareAppList();
      }
    );
  }

  async getCollectionAlert(){
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

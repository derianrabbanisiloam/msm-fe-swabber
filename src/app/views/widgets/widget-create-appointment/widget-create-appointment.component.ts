import * as moment from 'moment';
import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientService } from '../../../services/patient.service';
import { ScheduleService } from '../../../services/schedule.service';
import { GeneralService } from '../../../services/general.service';
import { DoctorService } from '../../../services/doctor.service';
import { AdmissionService } from '../../../services/admission.service';
import { AppointmentMini } from '../../../models/appointments/appointment-mini';
import { General } from '../../../models/generals/general';
import { Schedule } from '../../../models/schedules/schedule';
import { DoctorNote } from '../../../models/doctors/doctor-note';
import { DoctorProfile } from '../../../models/doctors/doctor-profile';
import { ScheduleBlock } from '../../../models/schedules/schedule-block';
import { doctorType } from '../../../variables/common.variable';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { 
  ModalCancelAppointmentComponent 
} from '../modal-cancel-appointment/modal-cancel-appointment.component'
import { 
  ModalCreateAppointmentComponent 
} from '../modal-create-appointment/modal-create-appointment.component';
import { 
  ModalScheduleBlockComponent 
} from '../../widgets/modal-schedule-block/modal-schedule-block.component';
import { 
  ModalPatientVerificationComponent 
} from '../../widgets/modal-patient-verification/modal-patient-verification.component';
import { appointmentPayload as appPayload } from '../../../payloads/appointment.payload';
import { reserveSlotAppPayload as reserveSlotPayload } from '../../../payloads/reserve-slot.payload';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { sourceApps, queueType } from '../../../variables/common.variable';
import { QueueService } from '../../../services/queue.service';
import { dateFormatter, regionTime} from '../../../utils/helpers.util';
import { 
  ModalRescheduleAppointmentComponent 
} from '../modal-reschedule-appointment/modal-reschedule-appointment.component';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import socket from 'socket.io-client';
import { 
  SecretKey, Jwt, 
  CHECK_IN, CREATE_APP, 
  CANCEL_APP, RESCHEDULE_APP,
  QUEUE_NUMBER, keySocket } from '../../../variables/common.variable';
import Security from 'msm-kadapat';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-widget-create-appointment',
  templateUrl: './widget-create-appointment.component.html',
  styleUrls: ['./widget-create-appointment.component.css'],
})
export class WidgetCreateAppointmentComponent implements OnInit {
  @Input() appointmentPayloadInput: appPayload;
  @Output() opSlotSelected = new EventEmitter<any>();
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  
  private socket;
  private socketTwo;
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

  public closeResult: string;
  public late: any;
  public selectedCheckIn: any;
  public listPayer: any;

  public listActiveAdmission: any = [];

  public nationalIdTypeId: any;

  public isLoadingCreateAdmission: boolean = false;
  public buttonCreateAdmission: boolean = false;
  public buttonPrintQueue: boolean = true;
  public buttonPatientLabel: boolean = true;
  public buttonCloseAdm: boolean = false;
  public buttonVIP: boolean = false;
  public buttonReguler: boolean = false;

  public payer: any;
  public payerNo: any;
  public payerEligibility: any;
  public txtPayer: boolean = true;
  public txtPayerNo: boolean = true;
  public txtPayerEligibility: boolean = true;

  public patientTypeList: General[];
  public patientType: General;
  public admissionTypeList: General[];
  public selectedAdmissionType: General;

  public listReferral: General[];
  public selectedReferral: General;
  public dateAdmission: any = dateFormatter(new Date, true);

  public closeAdm: any;
  public closeQue: any;

  public resQueue: any;
  public resMrLocal: any;
  public roomDetail: any;
  public detailTemp: any;

  public isOpen: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appointmentService: AppointmentService,
    private scheduleService: ScheduleService,
    private doctorService: DoctorService,
    private generalService: GeneralService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private patientService: PatientService,
    private admissionService: AdmissionService,
    private queueService: QueueService,
    modalSetting: NgbModalConfig,
  ) {
    this.socket = socket(`${environment.WEB_SOCKET_SERVICE + keySocket.APPOINTMENT}`,  {
      transports: ['websocket'],  
      query: `data=${
        Security.encrypt({ secretKey: SecretKey }, Jwt)
        }&url=${environment.FRONT_OFFICE_SERVICE}`,
      });
    
    this.socketTwo = socket(`${environment.WEB_SOCKET_SERVICE + keySocket.QUEUE}`,  {
      transports: ['websocket'],  
      query: `data=${
        Security.encrypt({ secretKey: SecretKey }, Jwt)
        }&url=${environment.FRONT_OFFICE_SERVICE}`,
      });
      
      modalSetting.backdrop = 'static';
      modalSetting.keyboard = false;
   }

  async ngOnInit() {
    await this.getQueryParams();
    await this.enableWalkInChecker();
    await this.getSchedule();
    await this.getDoctorProfile();
    await this.getDoctorNotes();
    await this.getScheduleBlock();
    await this.getAppointmentList();
    await this.prepareTimeSlot();
    await this.prepareAppList();
    await this.getPayer();
    await this.getPatientType();
    await this.admissionType();
    await this.getReferral();
    this.setTableHeader();
    this.emitCreateApp();
    this.emitCancelApp();
    this.emitVerifyApp();
    this.emitScheduleBlock();
    this.emitRescheduleApp();
    this.getCollectionAlert();

    this.socket.on(CREATE_APP, (call) => {
      if(call.data.schedule_id == this.appointmentPayload.scheduleId 
        && call.data.appointment_date == this.appointmentPayload.appointmentDate){
          if(this.doctorProfile.doctor_type_name === this.doctorType.FCFS){
            call.data.number = this.appointments.length;
          }
          this.appointments.push(call.data);
          this.prepareTimeSlot();
          this.prepareAppList();
      }
    });
    this.socket.on(CANCEL_APP, (call) => {
      if(call.data.schedule_id == this.appointmentPayload.scheduleId 
        && call.data.appointment_date == this.appointmentPayload.appointmentDate){
          this.appointments = this.appointments.filter((value) => {
          return value.appointment_id !== call.data.appointment_id;
          });
          this.prepareTimeSlot();
          this.prepareAppList();
      }
    });
    this.socket.on(CHECK_IN, (call) => {
      if(call.data.schedule_id == this.appointmentPayload.scheduleId 
        && call.data.appointment_date == this.appointmentPayload.appointmentDate){
        this.appointments = this.appointments.map((value) => {
          if (value.appointment_id === call.data.appointment_id) {
            value.admission_id = call.data.admission_id;
          }
          return value;
        });
        this.prepareAppList();
      }
    });
    this.socket.on(RESCHEDULE_APP,(call) => {
      if(this.appointments.length){
        this.appointments.map((value) => {
          if (value.appointment_id === call.data.after.appointment_id) {
            this.appointments = this.appointments.filter((value) => {
              return value.appointment_id !== call.data.after.appointment_id;;
            });
            this.prepareTimeSlot();
            this.prepareAppList();
          } else if (value.appointment_id !== call.data.after.appointment_id && value.schedule_id === call.data.after.schedule_id) {
            this.appointments.push(call.data.after);
            this.prepareAppList();
          }
        });
      } else {
        this.appointments.push(call.data);
        this.prepareAppList();
      }
    });
    this.socketTwo.on(QUEUE_NUMBER, (call) => {
      if(call.data.schedule_id == this.appointmentPayload.scheduleId 
        && call.data.appointment_date == this.appointmentPayload.appointmentDate){
        this.appointments = this.appointments.map((value) => {
          if (value.appointment_id === call.data.appointment_id) {
            value.queue_number = call.data.queue_number;
          }
          return value;
        });
        this.prepareAppList();
      }
    });
  }

  async ngOnChanges() {
    await this.getQueryParams();
    await this.enableWalkInChecker();
    await this.getSchedule();
    await this.getDoctorProfile();
    await this.getDoctorNotes();
    await this.getScheduleBlock();
    await this.getAppointmentList();
    await this.prepareTimeSlot();
    await this.prepareAppList();
    await this.getPayer();
    await this.getPatientType();
    await this.admissionType();
    await this.getReferral();
    this.setTableHeader();
    this.emitCreateApp();
    this.emitCancelApp();
    this.emitVerifyApp();
    this.emitScheduleBlock();
    this.emitRescheduleApp();
    this.getCollectionAlert();
  }

  async enableWalkInChecker(){
    const appointmentDate = this.appointmentPayload.appointmentDate;
    const zone = this.hospital.zone; 
    const dateNow = await regionTime(zone);
    this.isOpen = new Date(dateNow) < new Date(appointmentDate) ? false : true;
  }

  emitRescheduleApp() {
    this.appointmentService.rescheduleAppSource$.subscribe(
      result => {
        if (result) {
          this.alertService.success('Reschedule appointment berhasil', false, 3000);
        } else {
          this.alertService.error('Gagal reschedule appointment', false, 3000);
        }
      }
    );
  }

  emitVerifyApp() {
    this.appointmentService.verifyAppSource$.subscribe(
      async () => {
        await this.getAppointmentList();
        await this.prepareTimeSlot();
        await this.prepareAppList();
      }
    );
  }

  async refreshPage(){
    this.buttonCreateAdmission = false;
    this.buttonPrintQueue = true;
    this.buttonPatientLabel = true;
    this.buttonCloseAdm = false;

    this.resQueue = null;

    this.txtPayer = true;
    this.txtPayerNo = true;
    this.txtPayerEligibility = true;

    this.patientType = null;
    this.payer = null;
    this.payerNo = null;
    this.payerEligibility = null;
  }

  async admissionType(){
    this.admissionTypeList = await this.generalService.getAdmissionType()
    .toPromise().then( res => {
      return res.data;
    }).catch( err => {
      return [];
    })

    const idx = this.admissionTypeList.findIndex((i)=>{
      return i.value === '1';
    })

    this.selectedAdmissionType = this.admissionTypeList[idx];
  }

  async getReferral(){
    this.listReferral = await this.generalService.getReferralType()
    .toPromise().then( res => {
      return res.data;
    }).catch( err => {
      return [];
    })

    const idx = this.listReferral.findIndex((i)=>{
      return i.value === '1';
    })

    this.selectedReferral = this.listReferral[idx];

  }

  async getPatientType(){
    this.patientTypeList = await this.generalService.getPatientType()
    .toPromise().then( res => {
      if (res.status === 'OK' && res.data.length === 0) {
        this.alertService.success('No List Doctor in This Hospital', false, 3000);
      }
      
      return res.data;
    }).catch( err => {
      return [];
    })
  }

  async getPayer(){
    this.listPayer = await this.generalService.getPayer(this.hospital.orgId)
    .toPromise().then( res => {
      return res.data;
    }).catch( err => {
      return [];
    })
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
    const { quota, walkin } = this.doctorProfile;
    const duration = Math.round(60 / quota);
    let slotLength = Math.round(diffMinutes / duration);
    const docType = this.doctorProfile.doctor_type_name;
    slotLength = (docType === this.doctorType.HOURLY_APPOINTMENT) ? diffMinutes / 60 * quota : slotLength;
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
          appointment_temp_id: null,
          admission_id: null,
          appointment_no: i,
          patient_name: null,
          date_of_birth: null,
          local_mr_no: null,
          phone_no: null,
          queue_no: null,
          note: '',
          note_long: '',
          note_short: '',
          modified_name: '',
          modified_by: null,
          is_waiting_list: false,
          is_can_create: true,
          is_can_cancel: false,
          is_blocked: false,
          is_walkin: i % quota < quota-walkin ? false : true,
        });
      }
    } else if (docType === this.doctorType.FCFS) {
      for (let i=0, n=this.appointments.length; i<n; i++) {
        no += 1;
        this.appList.push({
          no: no,
          hospital_id: hospitalId,
          doctor_id: doctorId,
          appointment_range_time: appTime,
          appointment_from_time: fromTime,
          appointment_to_time: toTime,
          appointment_id: null,
          appointment_temp_id: null,
          admission_id: null,
          appointment_no: i,
          patient_name: null,
          date_of_birth: null,
          local_mr_no: null,
          phone_no: null,
          queue_no: null,
          note: '',
          note_long: '',
          note_short: '',
          modified_name: '',
          modified_by: null,
          is_waiting_list: false,
          is_can_create: true,
          is_can_cancel: false,
          is_blocked: false,
          is_walkin: false,
        });
      }

      let numberL;
      numberL = this.appointments.length > 0 ? Math.max.apply(Math, this.appointments.map(i => i.appointment_no)) : 0;
      const appListLength = numberL;
      no += 1;

      this.appList.push({
        no: no,
        hospital_id: hospitalId,
        doctor_id: doctorId,
        appointment_range_time: appListLength > 0 ? '' : appTime,
        appointment_from_time: fromTime,
        appointment_to_time: toTime,
        appointment_id: null,
        appointment_temp_id: null,
        admission_id: null,
        appointment_no: this.appointments.length > 0 ? numberL + 1 : 0,
        patient_name: null,
        date_of_birth: null,
        local_mr_no: null,
        phone_no: null,
        queue_no: null,
        note: '',
        note_long: '',
        note_short: '',
        modified_name: '',
        modified_by: null,
        is_waiting_list: false,
        is_can_create: true,
        is_can_cancel: false,
        is_blocked: false,
        is_walkin: false,
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
        if (Number(x.appointment_no) === i && x.is_waiting_list === false && this.doctorProfile.doctor_type_name !== this.doctorType.FCFS) {
          this.appList[i].appointment_id = x.appointment_id;
          this.appList[i].appointment_temp_id = x.appointment_temporary_id;
          this.appList[i].admission_id = x.admission_id;
          this.appList[i].appointment_no = x.appointment_no;
          this.appList[i].patient_name = x.contact_name;
          this.appList[i].date_of_birth = moment(x.birth_date).format('DD-MM-YYYY');
          this.appList[i].local_mr_no = x.medical_record_number;
          this.appList[i].phone_no = x.phone_number;
          this.appList[i].queue_no = x.queue_number;
          this.appList[i].note = x.appointment_note;
          this.appList[i].note_long = x.appointment_note ? x.appointment_note : '';
          this.appList[i].note_short = x.appointment_note && x.appointment_note.length > 30 ? x.appointment_note.substr(0, 30) + '...' : x.appointment_note;
          this.appList[i].modified_name = x.modified_name;
          this.appList[i].modified_by = x.modified_by;
          this.appList[i].is_waiting_list = x.is_waiting_list;
          this.appList[i].is_can_create = false;
          this.appList[i].is_can_cancel = true;
        }else if(Number(x.number) === i && x.is_waiting_list === false && this.doctorProfile.doctor_type_name === this.doctorType.FCFS){
          this.appList[i].appointment_id = x.appointment_id;
          this.appList[i].appointment_temp_id = x.appointment_temporary_id;
          this.appList[i].admission_id = x.admission_id;
          this.appList[i].appointment_no = x.appointment_no;
          this.appList[i].patient_name = x.contact_name;
          this.appList[i].date_of_birth = moment(x.birth_date).format('DD-MM-YYYY');
          this.appList[i].local_mr_no = x.medical_record_number;
          this.appList[i].phone_no = x.phone_number;
          this.appList[i].queue_no = x.queue_number;
          this.appList[i].note = x.appointment_note;
          this.appList[i].note_long = x.appointment_note ? x.appointment_note : '';
          this.appList[i].note_short = x.appointment_note && x.appointment_note.length > 30 ? x.appointment_note.substr(0, 30) + '...' : x.appointment_note;
          this.appList[i].modified_name = x.modified_name;
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
        if (appTimeCompare >= blockTimeStart && appTimeCompare < blockTimeEnd) {
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
          appointment_temp_id: x.appointment_temporary_id,
          admission_id: x.admission_id,
          patient_name: x.contact_name,
          date_of_birth: moment(x.birth_date).format('DD-MM-YYYY'),
          local_mr_no: x.medical_record_number,
          phone_no: x.phone_number,
          queue_no: x.queue_number,
          note: x.appointment_note,
          note_long: x.appointment_note ? x.appointment_note : '',
          note_short: x.appointment_note && x.appointment_note.length > 30 ? x.appointment_note.substr(0, 30) + '...' : x.appointment_note,
          modified_name: x.modified_name,
          modified_by: x.modified_by,
          is_waiting_list: x.is_waiting_list,
          is_can_create: false,
          is_can_cancel: isBlockWaitingList === false ? true : false,
          is_blocked: isBlockWaitingList,
        });
      }
    });

    let nextWlNo = 0;
    nextWlNo = this.appListWaiting.length === 0 ? nextWlNo : Math.max.apply(Math, this.appListWaiting.map(function(o) { return o.appointment_no }));

    this.appListWaiting.push({
      no: no + 1,
      appointment_range_time: this.appListWaiting.length > 0 ? '' : appTime,
      appointment_no: this.appListWaiting.length === 0 ? this.appList.length : nextWlNo + 1,
      appointment_id: null,
      appointment_temp_id: null,
      admission_id: null,
      patient_name: null,
      date_of_birth: null,
      local_mr_no: null,
      phone_no: null,
      queue_no: null,
      note: '',
      note_long: '',
      note_short: '',
      modified_name: '',
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
        for(let i=0, length=this.appointments.length; i<length; i++){
          this.appointments[i].number = i;
        } 
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

  openRescheduleModal(appointmentSelected: any){
    const modalRef = this.modalService.open(ModalRescheduleAppointmentComponent,  
      {windowClass: 'cc_modal_confirmation', size: 'lg'});
    modalRef.componentInstance.appointmentSelected = appointmentSelected;
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

  async verifyAppointment(appointmentId: string, temp = false){
    await this.appointmentService.getTempAppointment(appointmentId).toPromise().then(
      data => {
        this.detailTemp = data.data;
        const modalRef = this.modalService.open(ModalPatientVerificationComponent);modalRef.componentInstance.tempAppointmentSelected = this.detailTemp;
      }
    );
  }

  confirmCancelAppointment(appointmentId: string, temp = false) {
    const modalRef = this.modalService.open(ModalCancelAppointmentComponent);
    const payload = { appointmentId: appointmentId, temp: temp };
    modalRef.componentInstance.payload = payload;
  }

  async openCreateAppModal(item: any) {
    await this.reserveSlotApp(item);
    const canReserved = await this.getReservedSlot(item);
    const fromTime = item.appointment_from_time ? item.appointment_from_time : this.schedule.from_time;const toTime = item.appointment_to_time ? item.appointment_to_time : this.schedule.to_time; 
    const data = {
      schedule_id: this.appointmentPayload.scheduleId,
      appointment_date: this.appointmentPayload.appointmentDate,
      appointment_from_time: fromTime,
      appointment_to_time: toTime,
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
    const fromTime = item.appointment_from_time ? item.appointment_from_time : this.schedule.from_time;const toTime = item.appointment_to_time ? item.appointment_to_time : this.schedule.to_time;
    const data = {
      schedule_id: this.appointmentPayload.scheduleId,
      appointment_date: this.appointmentPayload.appointmentDate,
      appointment_from_time: fromTime,
      appointment_to_time: toTime,
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
        return data.data;
      }
    );
  }

  async checkInAppointment(appointmentId, content) {
    await this.appointmentService.getAppointmentById(appointmentId).subscribe(
      data => {
        this.selectedCheckIn = data.data[0];
        this.selectedCheckIn.custome_birth_date = dateFormatter(this.selectedCheckIn.birth_date, true);
      }
    );
    this.late = await this.checkIsLate(appointmentId);
    this.open(content);
  }

  checkIsLate(appointmentId: string){
    const msg = this.appointmentService.isLate(appointmentId)
    .toPromise().then( res => {
      if(res.data){
        return `${res.data.hours} Jam, ${res.data.minutes} Menit, ${res.data.seconds} Detik!!`;
      }else{
        return '';
      }
    }).catch(err => {
      return '';
    })
    return msg;
  }

  async defaultPatientType(patientHopeId: any){
    this.nationalIdTypeId = await this.patientService.getDefaultPatientType(patientHopeId).toPromise()
    .then(res => {
      if(res.data){
        return res.data.nationalIdTypeId; 
      }else{
        return '';
      }
    }).catch(err => {
      return '';
    })

    let idx = null;
    
    if(this.nationalIdTypeId){
      if(this.nationalIdTypeId == 3){
        //Passport
        idx = this.patientTypeList.findIndex((a)=>{
          return a.description == "PASSPORT";
        })
      }else if(this.nationalIdTypeId == 4){
        //KITAS
        idx = this.patientTypeList.findIndex((a)=>{
          return a.description == "KITAS";
        })
      }else{
        //Private
        idx = this.patientTypeList.findIndex((a)=>{
          return a.description == "PRIVATE";
        })
      }
    }else{
      idx = this.patientTypeList.findIndex((a)=>{
        return a.description == "PRIVATE";
      })
    }
    this.patientType = this.patientTypeList[idx];
  }

  async confirmCheckInValue(detail, checkInModal, mrLocalModal){
    this.nationalIdTypeId = '';
    let now = dateFormatter(new Date(), true);
    let appDate = dateFormatter(detail.appointment_date, true);

    if(now !== appDate){
      this.alertService.error('This appointment cannot checkin in this day', false, 3000);
    }else{
      if(!detail.medical_record_number){
        if(detail.patient_hope_id){
          this.open(mrLocalModal);
        }else{
          const params = {
            appointmentId: detail.appointment_id,
          };
          
          this.router.navigate(['./patient-data'], { queryParams: params });
        }
      }else{
        await this.defaultPatientType(detail.patient_hope_id);
        this.open50(checkInModal);
      }
    }
  }

  getActiveAdmission(patientHopeId: any){
    const active = this.admissionService.getActiveAdmission(patientHopeId)
    .toPromise().then(res => {
      return res.data;
    }).catch( err => {
      return [];
    });
    return active;
  }

  async createAdmission(val, activeModal){
    this.buttonCreateAdmission = true;

    this.listActiveAdmission = await this.getActiveAdmission(val.patient_hope_id);
    if(this.listActiveAdmission.length !== 0) {
      this.openconfirmation(activeModal);
    }else{
      this.processCreateAdmission(val);
    }
  }

  mrLocalProcess(payload: any){
    const patient = this.patientService.createMrLocal(payload)
    .toPromise().then(res => {
      this.alertService.success(res.message, false, 3000);
      return res.data; 
    }).catch(err => {
      this.alertService.error(err.error.message, false, 3000);
      return null;
    })
    
    return patient;
  }

  async buildMrLocal(detail, close, modal){
    const body = {
      patientHopeId: Number(detail.patient_hope_id),
      organizationId: Number(this.hospital.orgId),
      userId: this.user.id,
      source: sourceApps,
    }
    
    this.resMrLocal = await this.mrLocalProcess(body);
    
    if(this.resMrLocal){
      this.selectedCheckIn.medical_record_number = this.resMrLocal.medical_record_number;
      this.selectedCheckIn.patient_organization_id = this.resMrLocal.patient_organization_id;
      await this.defaultPatientType(detail.patient_hope_id);
      await this.getAppointmentList();
      await this.prepareTimeSlot();
      await this.prepareAppList();
      close.click();
      this.open50(modal);
    }
  }

  processCreateAdmission(val){
    // Show loading bar
    this.buttonCreateAdmission = true;
    this.isLoadingCreateAdmission = true;

    let payer = null;
    let payerNo = null;
    let payerEligibility = null;

    if(!this.patientType){
      this.alertService.error('Select patient type', false, 3000);
      this.buttonCreateAdmission = false;
      this.isLoadingCreateAdmission = false;
    }

    if(this.patientType.description === 'PAYER'){
      if(this.payer && this.payer.payer_id){
        payer = this.payer.payer_id;
        payerNo = this.payerNo;
        payerEligibility = this.payerEligibility
      }
    }

    const body = {
      appointmentId: val.appointment_id,
      organizationId: Number(this.hospital.orgId),
      patientTypeId: Number(this.patientType.value),
      admissionTypeId: this.selectedAdmissionType.value,
      payerId: payer,
      payerNo: payerNo,
      payerEligibility: payerEligibility,
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.fullname,
    };
    var dataPatient;

    this.admissionService.createAdmission(body).toPromise()
    .then( res => {
      dataPatient = {
        schedule_id: val.schedule_id,
        admission_id: res.data.admission_id,
        admission_hope_id: res.data.admission_hope_id,
        admission_no: res.data.admission_no,
        payer_name: res.data.payer_name,
        appointment_id: val.appointment_id,
        appointment_date: val.appointment_date,
        hospital_id: val.hospital_id,
        doctor_id: val.doctor_id,
        modified_name: res.data.modified_name,
        modified_date: res.data.modified_date,
        modified_from: res.data.modified_from,
        modified_by: res.data.modified_by
      }
      // broadcast check-in
      this.socket.emit(CHECK_IN, dataPatient);
      this.buttonCreateAdmission = true;
      this.buttonPrintQueue = false;
      this.buttonCloseAdm = true;
      this.buttonPatientLabel = false;
      this.isLoadingCreateAdmission = false;
      this.alertService.success(res.message, false, 3000);
    }).catch( err => {
      this.buttonCreateAdmission = false;
      this.isLoadingCreateAdmission = false;
      this.alertService.error(err.error.message, false, 3000);
    })

  }

  async printPatientLabel(val){
    const contentPdf = await this.admissionService.getPatientLabel(val.appointment_id).toPromise()
    .then( res => {
      return res.data;
    }).catch(err =>{
      return null;
    })

    if(contentPdf){
      await this.filePdfCreated(contentPdf);
    }else{
      this.alertService.error('Cannot print patient label', false, 3000);
    }
  }

  changeCondition(event:any){
    const val = event.target.value;
    let idx = null

    if(val == 'PRIVATE' || val == 'PASSPORT' || val == 'KITAS'){
      this.txtPayer = true;
      this.txtPayerNo = true;
      this.txtPayerEligibility = true;

      this.payer = null;
      this.payerNo = null;
      this.payerEligibility = null;

      if(val == 'PRIVATE'){
        idx = this.patientTypeList.findIndex((a)=>{
          return a.description == "PRIVATE";
        })
      }else if(val == 'KITAS'){
        idx = this.patientTypeList.findIndex((a)=>{
          return a.description == "KITAS";
        })
      }else if(val == 'PASSPORT'){
        idx = this.patientTypeList.findIndex((a)=>{
          return a.description == "PASSPORT";
        })
      }
    }else{
      this.txtPayer = false;
      this.txtPayerNo = false;
      this.txtPayerEligibility = false;

      idx = this.patientTypeList.findIndex((a)=>{
        return a.description == "PAYER";
      })
    }

    this.patientType = this.patientTypeList[idx];
  }

  filePdfCreated(val){
    const { 
      patientName, sex, phone, admissionNo, admissionDate, 
      alias, mrNoFormatted, barcode, age, admissionTime,
      doctorName, payer, patientType, labelBirth,
    } = val;

    const detailPayer = payer ? payer : patientType;
    const strName = patientName.toUpperCase();
    const strAge = age.toLowerCase();  
    let doctorPayer = doctorName+' / '+detailPayer;
        doctorPayer = doctorPayer.substr(0,55);

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const docDefinition = {
      pageSize:  { width: 292.283, height: 98.031},
      pageMargins: [ 0, 0, 0, 0 ],
      content: [
        { text: strName, style: 'header', bold: true , fontSize: 10, noWrap: true },
        { text: 'Sex: '+sex+' / Ph: '+phone, style: 'header', bold: true , fontSize: 10, noWrap: true },
        { text: 'MR No: '+alias+'.'+mrNoFormatted+' / DOB: '+labelBirth+' ('+strAge+') ', style: 'header', bold: true, fontSize: 10 },
        { text: admissionNo+' '+admissionDate+' '+admissionTime, style: 'header' , fontSize: 9},
        { text: doctorPayer, style: 'header', fontSize: 9 },
        {
          image: barcode,
          width: 100,
          height: 20,
          alignment: 'right'
        }
      ],
      styles: {
        header: {
          fontSize: 9
        }
      }

    };
    pdfMake.defaultFileName = 'report registration';
    pdfMake.createPdf(docDefinition).print();
  }


  printQueue(content, close){
    this.open(content);
    this.closeAdm = close;
  }
  
  async printQueueAction(val, isReguler, content){
    this.buttonReguler = true;
    this.buttonVIP = true;
    this.closeQue = content;
    
    const queueTypeId = isReguler ? queueType.REG : queueType.VIP;

    const body = {
      appointmentId: val.appointment_id,
      queueTypeId: queueTypeId,
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.fullname,
    };

    this.roomDetail = await this.scheduleService.scheduleDetail(val.schedule_id)
    .toPromise().then(res => {
      return res.data;
    }).catch( err => {
      return null;
    });

    var dataPatient;

    this.resQueue = await this.queueService.createQueue(body).toPromise()
      .then( res => {
        dataPatient = {
          schedule_id: val.schedule_id,
          appointment_id: val.appointment_id,
          appointment_date: val.appointment_date,
          hospital_id: val.hospital_id,
          doctor_id: val.doctor_id,
          queue_id: res.data.queue_id,
          queue_number: res.data.name,
          queue_type: res.data.queue_type_id,
          queue_status_id: res.data.queue_status_id,
          modified_name: res.data.modified_name,
          modified_date: res.data.modified_date,
          modified_from: res.data.modified_from,
          modified_by: res.data.modified_by
        }
        // broadcast queue-number
        this.socketTwo.emit(QUEUE_NUMBER, dataPatient);
        return res.data;
      }).catch(err => {
        this.alertService.error(err.error.message, false, 3000);
        return null;
      })
    
    this.selectedCheckIn = await this.appointmentService.getAppointmentById(val.appointment_id).toPromise().then( res => {
      return res.data[0];
    }).catch( err => {
      return null;
    });
  }

  newPatient(){
    const params = { appointmentId: this.selectedCheckIn.appointment_id, };
    this.router.navigate(['./patient-data'], { queryParams: params });
  }

  printQueueTicket(val) {

    const queueNo = this.resQueue.name;
    const isWalkin = val.is_walkin ? 'WALK IN' : 'APPOINTMENT';
    const patientName = val.contact_name;
    const doctorName = val.doctor_name;

    let floor = '';
    let wing = '';
    let room = '';

    if(this.roomDetail){
      floor = this.roomDetail.floor_name ? this.roomDetail.floor_name : floor;
      wing = this.roomDetail.wing_name ? this.roomDetail.wing_name : wing;
      room = this.roomDetail.room_name ? this.roomDetail.room_name : room; 
    }
    
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    
    const docDefinition = {
      pageSize:  { width: 252.283, height: 200},
      pageMargins: [ 0, 10, 10, 10 ],
      content: [
        {
          text: 'Your Queue Number',
          style: 'header',
          fontSize: 12,
          margin: [0, 0, 0, 0]
        },
        {
          text: queueNo,
          style: 'header',
          fontSize: 30 ,
          margin: [0, 5, 0, 5]
        },
        {
          text: 'Floor : '+floor+' , Wing : '+wing+' , Room : '+room,
          margin: [0, 0, 0, 0],
          alignment: 'center',
          fontSize: 10,
          bold: true
        },
        {
          text: 'Patient Name : '+patientName,
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 10
        },
        {
          text: 'Doctor Name : '+doctorName,
          margin: [0, 0, 0, 5],
          alignment: 'center',
          fontSize: 10
        },
        {
          text: isWalkin,
          margin: [0, 0, 0, 5],
          alignment: 'center',
          fontSize: 10,
          bold: true
        },

        {
          image: 'data:image/jpeg;base64,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',

          width: 100,
          height: 40,
          alignment: 'center'
        },
      ],
      styles: {
        header: {
          bold: true,
          alignment: 'center'
        }
      }

    };
    pdfMake.defaultFileName = 'report registration';
    pdfMake.createPdf(docDefinition).print();

    setTimeout (() => {
      this.closeQue.click();
      this.closeAdm.click();
      this.refreshPage();
    }, 1000);

  }


  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openconfirmation(content) {
    this.modalService.open(content, {windowClass: 'fo_modal_confirmation'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open50(content) {
    this.modalService.open(content, { windowClass: 'fo_modal_admission'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.refreshPage();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
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

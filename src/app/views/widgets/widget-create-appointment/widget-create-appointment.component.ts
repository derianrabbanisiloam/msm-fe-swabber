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
import { doctorType, typeFile, formatFile } from '../../../variables/common.variable';
import { NgbModalConfig, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
import { sourceApps, queueType, consultationType } from '../../../variables/common.variable';
import { QueueService } from '../../../services/queue.service';
import { dateFormatter, regionTime } from '../../../utils/helpers.util';
import {
  ModalRescheduleAppointmentComponent
} from '../modal-reschedule-appointment/modal-reschedule-appointment.component';
import {
  ModalAppointmentBpjsComponent
} from '../modal-appointment-bpjs/modal-appointment-bpjs.component';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import socket from 'socket.io-client';
import {
  SecretKey, Jwt,
  CHECK_IN, CREATE_APP,
  CANCEL_APP, RESCHEDULE_APP, RESERVE_SLOT, RELEASE_SLOT,
  QUEUE_NUMBER, keySocket, SCHEDULE_BLOCK, channelId, appointmentStatusId, 
  paymentStatus
} from '../../../variables/common.variable';
import Security from 'msm-kadapat';
import { environment } from '../../../../environments/environment';
import { 
  ModalVerificationAidoComponent 
} from '../../widgets/modal-verification-aido/modal-verification-aido.component';
import {
  ModalCreateAppBpjsComponent
} from '../modal-create-app-bpjs/modal-create-app-bpjs.component';
import { BpjsService } from '../../../services/bpjs.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PayerService } from 'src/app/services/payer.service';
import { debounceTime } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-widget-create-appointment',
  templateUrl: './widget-create-appointment.component.html',
  styleUrls: ['./widget-create-appointment.component.css'],
})
export class WidgetCreateAppointmentComponent implements OnInit {
  @Input() appointmentPayloadInput: any;
  @Output() opSlotSelected = new EventEmitter<any>();
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public assetPath = environment.ASSET_PATH;
  private socket;
  private socketTwo;
  private socketThree;
  public appointments: any;
  public appList: any = [];
  public schLength: number = 0;
  public appListWaiting: any = [];
  public appointmentPayload: appPayload = new appPayload;
  public schedule: any;
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
  public keyword: any;
  public listReferralSource: any = [];
  public listDiagnose: any = [];
  public inputList: boolean = true;
  public inputList2: boolean = false

  public listActiveAdmission: any = [];

  public nationalIdTypeId: any;

  public isLoadingCreateAdmission: boolean = false;
  public buttonCreateAdmission: boolean = false;
  public buttonPrintQueue: boolean = true;
  public buttonPatientLabel: boolean = true;
  public buttonCloseAdm: boolean = false;
  public buttonVIP: boolean = false;
  public buttonReguler: boolean = false;
  public buttonCheckEligible:boolean = true;

  public payer: any;
  public payerNo: any;
  public payerEligibility: any;
  public txtPayer: boolean = true;
  public txtPayerNo: boolean = true;
  public txtPayerEligibility: boolean = true;
  
  public diagnose: any;
  public referralNo: any;
  public refferalDate: any;
  public refferalSource: any;
  public diagnoseCode: any;
  public patientEligible: any;

  public referralDateModel: NgbDateStruct;

  public patientTypeList: General[];
  public patientType: General;
  public admissionTypeList: General[];
  public selectedAdmissionType: General;

  public listReferral: General[];
  public selectedReferral: General;
  public dateAdmission: any = dateFormatter(new Date, true);

  public closeAdm: any;
  public closeQue: any;
  public closeDocument: any;

  public resQueue: any;
  public resMrLocal: any;
  public roomDetail: any;
  public detailTemp: any;

  public isOpen: boolean = true;

  public slotList: any = [];

  public listRoomHope: any = [];
  public roomHope: any;
  public scheduleTemp: string;
  public doctorName: string;
  public hospitalName: string;
  public aidoChannel: any = channelId.AIDO;
  public appStatusId = appointmentStatusId;
  public payStatusId = paymentStatus;
  public selectedApp: any;
  public selectedAdm: any;
  public fromBpjs: boolean = false;
  public fromRegistration: boolean = false;
  public patFromBpjs: any;
  public bodyBpjs: any;
  public consulType: string = null;
  public urlBpjsCard = environment.GET_IMAGE;
  public maxSize10MB: number = 10485760;
  public listProvince: any = null;
  public listDistrict: any = null;
  public listSubDistrict: any = null;
  public isLakaLantas: boolean = false;
  public lakaLantasAssurance = {
  penjamin: null,
  tglKejadian: null,
  keterangan: null
  }
  public suplesi = {
    suplesi: null,
    noSepSuplesi: null,
    lokasiLaka: null
  }
  public lokasiLakaBody = {
    kdPropinsi: null, 
    kdKabupaten: null,
    kdKecamatan: null
  }
  public flagFile1: boolean = false;
  public flagFile2: boolean = false;
  public flagFile3: boolean = false;
  public flagFile4: boolean = false;
  public flagFile5: boolean = false;
  uploadForm: FormGroup;
  public assetUpload: any = null;
  public bodyUpload: any = {};
  public mask_birth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public reschBpjs: boolean = false;
  public flagCreateNewApp: boolean = false;
  public email: string = '';
  public emailTemp: string = '';
  public notes: string = '';
  public notesTemp: string = '';
  public isSigned: boolean = false;
  public isSignedTemp: boolean = false;
  public checkListModel: any = {
    checkOne: false, checkTwo: false, checkThree: false,
    checkFour: false, checkFive: false
  }


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appointmentService: AppointmentService,
    private scheduleService: ScheduleService,
    private doctorService: DoctorService,
    private generalService: GeneralService,
    private payerService: PayerService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private patientService: PatientService,
    private admissionService: AdmissionService,
    private queueService: QueueService,
    private bpjsService: BpjsService,
    private formBuilder: FormBuilder,
    modalSetting: NgbModalConfig,
  ) {
    this.socket = socket(`${environment.WEB_SOCKET_SERVICE + keySocket.APPOINTMENT}`, {
      transports: ['websocket'],
      query: `data=${
        Security.encrypt({ secretKey: SecretKey }, Jwt)
        }&url=${environment.FRONT_OFFICE_SERVICE}`,
    });

    this.socketTwo = socket(`${environment.WEB_SOCKET_SERVICE + keySocket.QUEUE}`, {
      transports: ['websocket'],
      query: `data=${
        Security.encrypt({ secretKey: SecretKey }, Jwt)
        }&url=${environment.FRONT_OFFICE_SERVICE}`,
    });

    this.socketThree = socket(environment.WEB_SOCKET_SERVICE + keySocket.SCHEDULE, {
      transports: ['websocket'],  
      query: `data=${
        Security.encrypt({ secretKey: SecretKey }, Jwt)
        }&url=${environment.FRONT_OFFICE_SERVICE}`,
    });

    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
  }

  async ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      bpjsCard: [''],
      identityCard: [''],
      referenceLetter: [''],
      familyCard: [''],
      controlLetter: ['']
    });

    await this.getAppBpjs();
    //await this.provinceLakaLantas();
    await this.getQueryParams();
    await this.enableWalkInChecker(); 
    await this.getSchedule();
    await this.getDoctorProfile();
    await this.getDoctorNotes();
    await this.getScheduleBlock();
    await this.getAppointmentList();
    await this.getSlotTime();
    await this.dataProcessing();
    await this.getPayer();
    await this.getPatientType();
    await this.admissionType();
    await this.getListRoomHope();
    await this.getReferral();
    this.setTableHeader();
    this.emitCreateApp();
    this.emitCancelApp();
    this.emitVerifyApp();
    this.emitScheduleBlock();
    this.emitRescheduleApp();
    this.getCollectionAlert();

    //socket reserve slot
    this.socketTwo.on(RESERVE_SLOT+'/'+this.hospital.id, (call) => {
      for(let k = 0, { length } = this.slotList; k < length; k += 1) {
        if (call.data.scheduleId == this.slotList[k].schedule_id
          && call.data.appointmentDate == this.appointmentPayload.appointmentDate
          && call.data.appointmentNo == this.slotList[k].appointment_no
          && call.data.userId != this.userId) {
          this.slotList[k].is_reserved_slot = true;
          this.dataProcessing();
        }
      }
    });

    //socket release slot
    this.socketTwo.on(RELEASE_SLOT+'/'+this.hospital.id, (call) => {
      for(let k = 0, { length } = this.slotList; k < length; k += 1) {
        if (call.data.scheduleId == this.slotList[k].schedule_id
          && call.data.appointmentDate == this.appointmentPayload.appointmentDate
          && call.data.appointmentNo == this.slotList[k].appointment_no
          && call.data.userId != this.userId) {
          this.slotList[k].is_reserved_slot = false;
          this.dataProcessing();
        }
      }
    });

    //scoket create appointment
    this.socket.on(CREATE_APP+'/'+this.hospital.id, (call) => {
      for(let k = 0, { length } = this.schedule; k < length; k += 1) {
        if (call.data.schedule_id == this.schedule[k].schedule_id
          && call.data.appointment_date == this.appointmentPayload.appointmentDate) {
          this.appointments = this.appointments.filter((value) => {
            if(call.data.appointment_temporary_id) {
              return value.appointment_temporary_id !== call.data.appointment_temporary_id;
            }
            else { 
              return value.appointment_id !== call.data.appointment_id; 
            }
          });
          this.appointments.push(call.data);
          this.dataProcessing();
        }
      }
    });

    //socket cancel appointment
    this.socket.on(CANCEL_APP+'/'+this.hospital.id, (call) => {
      for(let k = 0, { length } = this.schedule; k < length; k += 1) {
        if (call.data.schedule_id == this.schedule[k].schedule_id
          && call.data.appointment_date == this.appointmentPayload.appointmentDate) {
          this.appointments = this.appointments.filter((value) => {
            if(call.data.appointment_temporary_id) {
              return value.appointment_temporary_id !== call.data.appointment_temporary_id;
            }
            else { 
              return value.appointment_id !== call.data.appointment_id; 
            }
          });
          this.dataProcessing();
        }
      }
    });

    //socket checkin appointment
    this.socket.on(CHECK_IN+'/'+this.hospital.id, (call) => {
      for(let k = 0, { length } = this.schedule; k < length; k += 1) {
        if (call.data.schedule_id == this.schedule[k].schedule_id
          && call.data.appointment_date == this.appointmentPayload.appointmentDate) {
          this.appointments = this.appointments.map((value) => {
            if (value.appointment_id === call.data.appointment_id) {
              value.admission_id = call.data.admission_id;
            }
            return value;
          });
          this.dataProcessing();
        }
      }
    });

    //socket reschedule appointment
    this.socket.on(RESCHEDULE_APP+'/'+this.hospital.id, (call) => {
      if (this.appointments.length) {
        let flag: any = '';
        this.appointments.map((value) => {
          if ((value.appointment_id === call.data.after.appointment_id
            || value.appointment_temporary_id === call.data.after.appointment_temporary_id)
            && value.schedule_id !== call.data.after.schedule_id) { //for appointment move to other schedule
            this.appointments = this.appointments.filter((value) => {
              if(call.data.after.appointment_temporary_id) {
                return value.appointment_temporary_id !== call.data.after.appointment_temporary_id;
              }
              else {
                return value.appointment_id !== call.data.after.appointment_id; 
              }
            });
            this.dataProcessing();
          } else if (value.schedule_id === call.data.after.schedule_id
            && value.schedule_id === call.data.before.schedule_id 
            && ((value.appointment_id !== flag
            && value.appointment_id === call.data.after.appointment_id)
            || (value.appointment_temporary_id !== flag
            && value.appointment_temporary_id === call.data.after.appointment_temporary_id))) { //for appointment move to the slot time with same schedule
              if(call.data.after.appointment_temporary_id) {
                flag = call.data.after.appointment_temporary_id;
                this.appointments = this.appointments.filter((value) => {
                  return value.appointment_temporary_id !== call.data.after.appointment_temporary_id;
                });
              }
              else {
                flag = call.data.after.appointment_id;
                this.appointments = this.appointments.filter((value) => {
                  return value.appointment_id !== call.data.after.appointment_id;
                });
              }
            this.appointments.push(call.data.after);
            this.dataProcessing();
          } else if (value.schedule_id === call.data.after.schedule_id
            && value.schedule_id !== call.data.before.schedule_id 
            && ((value.appointment_id !== flag
            && value.appointment_id !== call.data.after.appointment_id)
            || (value.appointment_temporary_id !== flag
            && value.appointment_temporary_id !== call.data.after.appointment_temporary_id))) { //for appointment move to this schedule
              if(call.data.after.appointment_temporary_id) {
                flag = call.data.after.appointment_temporary_id;
              }
              else {
                flag = call.data.after.appointment_id; 
              }
            this.appointments.push(call.data.after);
            this.dataProcessing();
          }
        });
      } else {
        this.appointments.push(call.data.after);
        this.dataProcessing();
      }
    });

    //scoket queue number
    this.socketTwo.on(QUEUE_NUMBER+'/'+this.hospital.id, (call) => {
      for(let k = 0, { length } = this.schedule; k < length; k += 1) {
        if (call.data.schedule_id == this.schedule[k].schedule_id
          && call.data.appointment_date == this.appointmentPayload.appointmentDate) {
          this.appointments = this.appointments.map((value) => {
            if (value.appointment_id === call.data.appointment_id) {
              value.queue_number = call.data.queue_number;
            }
            return value;
          });
          this.dataProcessing();
        }
      }
    });

    //socket block slot
    this.socketThree.on(SCHEDULE_BLOCK+'/'+this.schedule[0].hospital_id, (call) => {
      for(let k = 0, { length } = this.schedule; k < length; k += 1) {
        if(call.data.schedule_id === this.schedule[k].schedule_id
          && call.data.from_date === this.appointmentPayload.appointmentDate) {
            this.emitBlockSchedule();
          }
      }
    });
  }

  async emitBlockSchedule() {
    await this.getScheduleBlock();
    await this.getAppointmentList();
    await this.getSlotTime(); 
    await this.dataProcessing();
  }

  async ngOnChanges() {
    await this.getAppBpjs();
    //await this.provinceLakaLantas();
    await this.getQueryParams();
    await this.enableWalkInChecker();
    await this.getSchedule();
    await this.getDoctorProfile();
    await this.getDoctorNotes();
    await this.getScheduleBlock();
    await this.getAppointmentList();
    await this.getSlotTime();
    await this.dataProcessing();
    await this.getPayer();
    await this.getPatientType();
    await this.admissionType();
    await this.getListRoomHope();
    await this.getReferral();
    this.setTableHeader();
    this.emitCreateApp();
    this.emitCancelApp();
    this.emitVerifyApp();
    this.emitScheduleBlock();
    this.emitRescheduleApp();
    this.getCollectionAlert();
  }

  async changeCheckbox(val) {
    if(val === '1') this.checkListModel.checkOne = this.checkListModel.checkOne ? true : false;
    else if(val === '2') this.checkListModel.checkTwo = this.checkListModel.checkTwo ? true : false;
    else if(val === '3') this.checkListModel.checkThree = this.checkListModel.checkThree ? true : false;
    else if(val === '4') this.checkListModel.checkFour = this.checkListModel.checkFour ? true : false;
    else if(val === '5') this.checkListModel.checkFive = this.checkListModel.checkFive ? true : false;
  }

  lakaLantasVal(modal?) {
    this.isLakaLantas = this.isLakaLantas ? true : false;
    if(this.isLakaLantas === true) this.modalService.open(modal, { windowClass: 'fo_modal_admission_2', size: 'lg' });
    else {
      this.cancelLakaLantas();
    }
  }

  cancelLakaLantas() {
    this.isLakaLantas = false;
    this.lakaLantasAssurance = {
      penjamin: null,
      tglKejadian: null,
      keterangan: null
      }
    this.suplesi = {
        suplesi: null,
        noSepSuplesi: null,
        lokasiLaka: null
      }
    this.lokasiLakaBody = {
        kdPropinsi: null, 
        kdKabupaten: null,
        kdKecamatan: null
      }
  }

  async getAppBpjs() {
    if (this.doctorService.searchDoctorSource2) {
      if(this.doctorService.searchDoctorSource2.fromBpjs === true &&
        this.doctorService.searchDoctorSource2.fromRegistration === false) { //from BPJS request list
          localStorage.setItem('fromBPJS', JSON.stringify(this.doctorService.searchDoctorSource2));
          this.bodyBpjs = this.doctorService.searchDoctorSource2;
          this.fromBpjs = true;
          this.fromRegistration = false;
          this.patFromBpjs = this.doctorService.searchDoctorSource2.patientBpjs;
          this.consulType = this.doctorService.searchDoctorSource2.consulType;
  
      } else if (this.doctorService.searchDoctorSource2.fromBpjs === true &&
        this.doctorService.searchDoctorSource2.fromRegistration === true) { //from BPJS registration
          localStorage.setItem('fromBPJS', JSON.stringify(this.doctorService.searchDoctorSource2));
          this.bodyBpjs = this.doctorService.searchDoctorSource2;
          this.fromBpjs = true;
          this.fromRegistration = true;
          this.consulType = this.doctorService.searchDoctorSource2.consulType;
          
        }
    } else if(this.activatedRoute.snapshot.queryParamMap.get('fromBpjs') === 'true' &&
        this.activatedRoute.snapshot.queryParamMap.get('fromRegistration') === 'false') {
        this.bodyBpjs = JSON.parse(localStorage.getItem('fromBPJS'));
        this.fromBpjs = true;
        this.fromRegistration = false;
        this.patFromBpjs = this.bodyBpjs.patientBpjs;
        this.consulType = this.bodyBpjs.consulType;

    } else if(this.activatedRoute.snapshot.queryParamMap.get('fromBpjs') === 'true' &&
        this.activatedRoute.snapshot.queryParamMap.get('fromRegistration') === 'true') {
        this.bodyBpjs = JSON.parse(localStorage.getItem('fromBPJS'));
        this.fromBpjs = true;
        this.fromRegistration = true;
        this.consulType = this.bodyBpjs.consulType;
    }
  }

  async upload(event, nameFile){
    if (event.target.files.length > 0) {
      if(event.target.files[0].type === typeFile.image || event.target.files[0].type === typeFile.pdf) {
        if(event.target.files[0].size > this.maxSize10MB) {
          Swal.fire({
            position: 'center',
            type: 'error',
            title: 'Max size 10MB',
            showConfirmButton: false,
            timer: 2000
          })
        } else {
          let file;
          const formData_1 = new FormData();
          if(nameFile === 'bpjsCard') {
            this.flagFile1 = true;
            file = event.target.files[0];
            this.uploadForm.get('bpjsCard').setValue(file);
            formData_1.append('bpjs_bpjs_card', this.uploadForm.get('bpjsCard').value);
          } 
          else if(nameFile === 'identityCard') {
            this.flagFile2 = true;
            file = event.target.files[0];
            this.uploadForm.get('identityCard').setValue(file);
            formData_1.append('bpjs_identity_card', this.uploadForm.get('identityCard').value);
          }
          else if(nameFile === 'familyCard') {
            this.flagFile3 = true;
            file = event.target.files[0];
            this.uploadForm.get('familyCard').setValue(file);
            formData_1.append('bpjs_family_card', this.uploadForm.get('familyCard').value);
          }
          else if(nameFile === 'referenceLetter') {
            this.flagFile4 = true;
            file = event.target.files[0];
            this.uploadForm.get('referenceLetter').setValue(file);
            formData_1.append('bpjs_reference_letter', this.uploadForm.get('referenceLetter').value);
          }
          else if(nameFile === 'controlLetter') {
            this.flagFile5 = true;
            file = event.target.files[0];
            this.uploadForm.get('controlLetter').setValue(file);
            formData_1.append('bpjs_control_letter', this.uploadForm.get('controlLetter').value);
          }
            this.assetUpload = await this.patientService.uploadDocBpjs(formData_1)
            .toPromise().then(res => {
              this.uploadForm = this.formBuilder.group({
                bpjsCard: [''],
                identityCard: [''],
                referenceLetter: [''],
                familyCard: [''],
                controlLetter: ['']
              });
              this.flagFile1 = false;
              this.flagFile2 = false;
              this.flagFile3 = false;
              this.flagFile4 = false;
              this.flagFile5 = false;
              
              return res.data;
            }).catch(err => {
              this.flagFile1 = false;
              this.flagFile2 = false;
              this.flagFile3 = false;
              this.flagFile4 = false;
              this.flagFile5 = false;
              Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: err.error.message,
                timer: 4000
              })
              return null
            });
            if(this.assetUpload) {
              this.editAppointmentData(this.assetUpload[0].name, nameFile)
            }
        }
      } else {
        Swal.fire({
          position: 'center',
          type: 'error',
          title: 'Format file JPG and PDF only',
          showConfirmButton: false,
          timer: 2000
        })
      }
    }
  }

  async editAppointmentData(pathFile, nameFile) {
    this.bodyUpload = {
      userId: this.user.id,
      userName: this.user.username,
      source: sourceApps,
    }
    if(nameFile === 'bpjsCard') this.bodyUpload.bpjsCardFile = pathFile;
    else if(nameFile === 'identityCard') this.bodyUpload.identityCardFile = pathFile;
    else if(nameFile === 'referenceLetter') this.bodyUpload.refferenceLetterFile = pathFile;
    else if(nameFile === 'familyCard') this.bodyUpload.familyCardFile = pathFile;
    else if(nameFile === 'controlLetter') this.bodyUpload.controlLetterFile = pathFile;
    
    this.appointmentService.updateAppBpjs(this.selectedCheckIn.appointment_id, this.bodyUpload).subscribe(
      data => {
        this.bodyUpload = {};
        this.refreshDataApp(this.selectedCheckIn.appointment_id);
        if(nameFile === 'bpjsCard') this.uploadForm.get('bpjsCard').setValue(null);
        else if(nameFile === 'identityCard') this.uploadForm.get('identityCard').setValue(null);
        else if(nameFile === 'referenceLetter') this.uploadForm.get('referenceLetter').setValue(null);
        else if(nameFile === 'familyCard') this.uploadForm.get('familyCard').setValue(null);
        else if(nameFile === 'controlLetter') this.uploadForm.get('controlLetter').setValue(null);
        Swal.fire({
          position: 'center',
          type: 'success',
          title: 'Upload Successful',
          showConfirmButton: false,
          timer: 2000
        })
      }, error => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: error.error.message,
          timer: 4000
        })
      }
    )
  }

  suplesiCheckBox() {
    this.suplesi.suplesi = this.suplesi.suplesi ? 1 : 0;
  }

  // async provinceLakaLantas() {
  //   const hospitalId = this.hospital.id;
  //   this.listProvince = await this.bpjsService.getProvinceLakaLantas(hospitalId)
  //     .toPromise().then(res => {
  //       return res.data;
  //     }).catch(err => {
  //       return null;
  //     })
  // }

  // async districtLakaLantas() {
  //   const hospitalId = this.hospital.id;
  //   const provinceId = this.lokasiLakaBody.kdPropinsi ? this.lokasiLakaBody.kdPropinsi : null;
  //   if(provinceId) {
  //     this.listDistrict = await this.bpjsService.getDistrictLakaLantas(hospitalId, provinceId)
  //     .toPromise().then(res => {
  //       return res.data;
  //     }).catch(err => {
  //       return null;
  //     })
  //   }
  // }

  // async subDistrictLakaLantas() {
  //   const hospitalId = this.hospital.id;
  //   const districtId = this.lokasiLakaBody.kdKabupaten ? this.lokasiLakaBody.kdKabupaten : null;
  //   if(districtId) {
  //     this.listSubDistrict = await this.bpjsService.getSubDistrictLakaLantas(hospitalId, districtId)
  //     .toPromise().then(res => {
  //       return res.data;
  //     }).catch(err => {
  //       return null;
  //     })
  //   }
  // }

  async enableWalkInChecker() {
    //to enable or disable button checkin and slot walkin 
    const appointmentDate = this.appointmentPayload.appointmentDate;
    const zone = this.hospital.zone;
    const dateNow = await regionTime(zone);
    this.isOpen = new Date(dateNow) < new Date(appointmentDate) ? false : true;
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

  emitVerifyApp() {
    this.appointmentService.verifyAppSource$.subscribe(
      async () => {
        await this.getAppointmentList();
        await this.dataProcessing();
      }
    );
  }

  async refreshPage() {
    this.buttonCreateAdmission = false;
    this.buttonPrintQueue = true;
    this.buttonPatientLabel = true;
    this.buttonCloseAdm = false;
    this.buttonCheckEligible = true;

    this.resQueue = null;

    this.txtPayer = true;
    this.txtPayerNo = true;
    this.txtPayerEligibility = true;

    this.patientType = null;
    this.payer = null;
    this.payerNo = null;
    this.payerEligibility = null;
    this.roomHope = null;
    this.diagnose = null;
    this.diagnoseCode = null;
  }

  async getListRoomHope() {
    const organizationId = this.hospital.orgId;
    this.listRoomHope = await this.generalService.getRoomHope(organizationId)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        return [];
      })
  }

  async admissionType() {
    this.admissionTypeList = await this.generalService.getAdmissionType()
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        return [];
      })

    const idx = this.admissionTypeList.findIndex((i) => {
      return i.value === '1';
    })

    this.selectedAdmissionType = this.admissionTypeList[idx];
  }

  async getReferral() {
    this.listReferral = await this.generalService.getReferralType()
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        return [];
      })

    const idx = this.listReferral.findIndex((i) => {
      return i.value === '1';
    })

    this.selectedReferral = this.listReferral[idx];

  }

  async getPatientType() {
    this.patientTypeList = await this.generalService.getPatientType()
      .toPromise().then(res => {
        if (res.status === 'OK' && res.data.length === 0) {
          this.alertService.success('No List Doctor in This Hospital', false, 3000);
        }
        return res.data;
      }).catch(err => {
        return [];
      })
  }

  async getPayer() {
    this.listPayer = await this.generalService.getPayer(this.hospital.orgId)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        return [];
      })
  }

  async getReferralSource(){
      let payload = {
        payerId: this.payer.payer_id,
        organizationId: this.hospital.orgId,
        keyword: this.keyword
      }

      this.listReferralSource = await this.payerService.getListRefferal(payload)
        .toPromise().then(res => {
          return res.data
        }).catch(err => {
          return []
        })
  }

  async createAdmissionPayer(){
    let payload = {
      payerNo: this.payerNo,
      payerEligibility: this.payerEligibility,
      procedureRoomId: this.selectedCheckIn,
      diseaseClassificationId: this.diagnose.disease_classification_id,
      referralNo: this.referralNo,
      referralSource: this.refferalSource,
      referralDate: this.referralDateModel,
      userId: this.userId,
      source: this.source,
      userName: this.user.fullname
    }
  }


  async getDiagnose(){
    let payload = {
      patientId: this.selectedCheckIn.patient_hope_id,
      keyword: this.keyword
    }

    this.listDiagnose = await this.payerService.getDeaseClasification(payload)
    .toPromise().then(res => {
      return res.data
    }).catch(err => {
      return []
    })
  } 
  
  getQueryParams() {
    if (this.appointmentPayloadInput) { //from modal reschedule appointment
      this.appointmentPayload.doctorId = this.appointmentPayloadInput.doctorId;
      this.appointmentPayload.appointmentDate = this.appointmentPayloadInput.appointmentDate;
      this.isOriginal = false;
      this.consulType = this.appointmentPayloadInput.consulType ? this.appointmentPayloadInput.consulType : null; //reschedule bpjs
      this.reschBpjs = this.appointmentPayloadInput.isRescheduleBpjs === true ? true : false; //reschedule bpjs
    } else { //from menu doctor schedule
      this.appointmentPayload.doctorId = this.activatedRoute.snapshot.queryParamMap.get('doctorId');
      this.appointmentPayload.appointmentDate = this.activatedRoute.snapshot.queryParamMap.get('date');
    }
    if (!this.appointmentPayload.doctorId && !this.appointmentPayload.appointmentDate) {
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

  async dataProcessing() {
    //this function use to make list appointment base on slot time
    this.appList = [];
    this.appListWaiting = [];

    const hospitalId = this.schedule[0].hospital_id;
    const doctorId = this.schedule[0].doctor_id;
    const doctorName = this.schedule[0].doctor_name;

    //this param using in waiting list and FCFS
    let no;
    this.schLength = this.schedule.length;
    for(let k = 0, { length } = this.schedule; k < length; k += 1) {
      const docType = this.schedule[k].doctor_type_name;
      no = 0;
      const fromTime = this.schedule[k].from_time;
      const toTime = this.schedule[k].to_time;
      let appTime = `${fromTime} - ${toTime}`;
      this.appList.push(
        {
          schedule_id: this.schedule[k].schedule_id,
          doctor_type_name: this.schedule[k].doctor_type_name,
          is_allow_waiting_list: this.schedule[k].is_allow_waiting_list,
          consultation_type_id: this.schedule[k].consultation_type_id,
          appointment: []
        }
      )
      this.appListWaiting.push(
        {
          schedule_id: this.schedule[k].schedule_id,
          consultation_type_id: this.schedule[k].consultation_type_id,
          appointment: []
        }
      )
     //using slot time only for doctor type FIX and HOURLY
     if (docType === this.doctorType.FIX_APPOINTMENT
      || docType === this.doctorType.HOURLY_APPOINTMENT) {
      for (let i = 0, { length } = this.slotList; i < length; i += 1) {
        if(this.appList[k].schedule_id === this.slotList[i].schedule_id) {
          let found = false;
          let idx = 0;
          for (let j = 0, { length: totalApp } = this.appointments; j < totalApp; j += 1) {
            if((this.slotList[i].schedule_id === this.appointments[j].schedule_id) ||
                (this.appointments[j].channel_id === channelId.AIDO)){
              if ((Number(this.appointments[j].appointment_no) === this.slotList[i].appointment_no
                    && this.appointments[j].is_waiting_list === false) ||
                  ((this.appointments[j].from_time.substr(0,5) === this.slotList[i].schedule_from_time) &&
                  (this.appointments[j].to_time.substr(0,5) === this.slotList[i].schedule_to_time) &&
                  (this.appointments[j].channel_id === channelId.AIDO))) {
                found = true; //appointment slot already taken
                idx = j;
              }
            } 
          }

          if (found && idx >= 0) {
            this.appList[k].appointment.push({
              no: this.slotList[i].no,
              hospital_id: hospitalId,
              doctor_id: doctorId,
              doctor_name: doctorName, 
              appointment_range_time: this.slotList[i].appointment_range_time,
              appointment_from_time: this.slotList[i].schedule_from_time,
              appointment_to_time: this.slotList[i].schedule_to_time,
              schedule_from_time: fromTime,
              schedule_to_time: toTime,
              appointment_id: this.appointments[idx].appointment_id,
              appointment_date: this.appointments[idx].appointment_date,
              appointment_temp_id: this.appointments[idx].appointment_temporary_id,
              admission_id: this.appointments[idx].admission_id,
              appointment_no: this.appointments[idx].appointment_no,
              patient_name: this.appointments[idx].contact_name,
              contact_id: this.appointments[idx].contact_id,
              date_of_birth: moment(this.appointments[idx].birth_date).format('DD-MM-YYYY'),
              local_mr_no: this.appointments[idx].medical_record_number,
              phone_no: this.appointments[idx].phone_number,
              queue_no: this.appointments[idx].queue_number,
              note: this.appointments[idx].appointment_note ? this.appointments[idx].appointment_note : '',
              note_long: this.appointments[idx].appointment_note ? this.appointments[idx].appointment_note : '',
              note_short: this.appointments[idx].appointment_note && this.appointments[idx].appointment_note.length > 30 ? this.appointments[idx].appointment_note.substr(0, 30) + '...' : this.appointments[idx].appointment_note,
              modified_name: this.appointments[idx].modified_name,
              modified_by: this.appointments[idx].modified_by,
              is_waiting_list: this.appointments[idx].is_waiting_list,
              is_can_create: false,
              is_can_cancel: this.slotList[i].is_blocked ? false : true,
              is_blocked: this.slotList[i].is_blocked,
              is_walkin: this.slotList[i].is_walkin,
              is_reserved_slot: this.slotList[i].is_reserved_slot,
              schedule_id: this.schedule[k].schedule_id,
              doctor_type_id: this.schedule[k].doctor_type_id,
              channel_id: this.appointments[idx].channel_id ? this.appointments[idx].channel_id : null,
              admission_status_id: this.appointments[idx].admission_status_id ? this.appointments[idx].admission_status_id : null,
              appointment_status_id: this.appointments[idx].appointment_status_id ? this.appointments[idx].appointment_status_id : null,
              patient_hope_id: this.appointments[idx].patient_hope_id ? this.appointments[idx].patient_hope_id : null,
              patient_organization_id: this.appointments[idx].patient_organization_id ? this.appointments[idx].patient_organization_id : null,
              is_double_mr: this.appointments[idx].is_double_mr ? this.appointments[idx].is_double_mr : false,
              payment_status_id: this.appointments[idx].payment_status_id ? this.appointments[idx].payment_status_id : '',
              bpjs_card_file: this.appointments[idx].bpjs_card_file ? this.appointments[idx].bpjs_card_file : '',
              identity_card_file: this.appointments[idx].identity_card_file ? this.appointments[idx].identity_card_file : '',
              family_card_file: this.appointments[idx].family_card_file ? this.appointments[idx].family_card_file : '',
              refference_letter_file: this.appointments[idx].refference_letter_file ? this.appointments[idx].refference_letter_file : '',
              selfie_with_identity_file: this.appointments[idx].selfie_with_identity_file ? this.appointments[idx].selfie_with_identity_file : ''
            });
          } else {
            this.appList[k].appointment.push({
              no: this.slotList[i].no,
              hospital_id: hospitalId,
              doctor_id: doctorId,
              doctor_name: doctorName,
              appointment_range_time: this.slotList[i].appointment_range_time,
              appointment_from_time: this.slotList[i].schedule_from_time,
              appointment_to_time: this.slotList[i].schedule_to_time,
              schedule_from_time: fromTime,
              schedule_to_time: toTime,
              appointment_id: null,
              appointment_date: null,
              appointment_temp_id: null,
              admission_id: null,
              appointment_no: this.slotList[i].appointment_no,
              patient_name: null,
              contact_id: null,
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
              is_can_create: this.slotList[i].is_blocked ? false : true,
              is_can_cancel: false,
              is_blocked: this.slotList[i].is_blocked,
              is_walkin: this.slotList[i].is_walkin,
              is_reserved_slot: this.slotList[i].is_reserved_slot,
              schedule_id: this.schedule[k].schedule_id,
              doctor_type_id: this.schedule[k].doctor_type_id,
              channel_id: null,
              admission_status_id: null,
              appointment_status_id: null,
              patient_hope_id: null,
              patient_organization_id: null,
              is_double_mr: false,
              payment_status_id: '',
              bpjs_card_file: '',
              identity_card_file: '',
              family_card_file: '',
              refference_letter_file: '',
              selfie_with_identity_file: ''
            });
          }
        }
      }



      /** Appointment waiting list */
      let isBlockWaitingList = false;
      this.scheduleBlocks.map(x => {
        if (x.schedule_id === this.appListWaiting[k].schedule_id) {
          if (x.is_include_waiting_list === true) isBlockWaitingList = true;
        }
        
      });

      this.appointments.map((x, index) => {
        if (x.is_waiting_list === true && this.appListWaiting[k].schedule_id === x.schedule_id) {
          no += 1;
          appTime = no === 1 ? appTime : '';
          this.appListWaiting[k].appointment.push({
            no: no,
            hospital_id: hospitalId,
            doctor_id: doctorId,
            doctor_name: doctorName,
            appointment_range_time: appTime,
            appointment_from_time: fromTime,
            appointment_to_time: toTime,
            appointment_no: x.appointment_no,
            appointment_id: x.appointment_id,
            appointment_date: x.appointment_date,
            appointment_temp_id: x.appointment_temporary_id,
            admission_id: x.admission_id,
            patient_name: x.contact_name,
            contact_id: x.contact_id,
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
            schedule_id: this.schedule[k].schedule_id,
            doctor_type_id: this.schedule[k].doctor_type_id,
            channel_id: x.channel_id ? x.channel_id : null,
            admission_status_id: x.admission_status_id ? x.admission_status_id : null,
            appointment_status_id: x.appointment_status_id ? x.appointment_status_id : null,
            patient_hope_id: x.patient_hope_id ? x.patient_hope_id : null,
            patient_organization_id: x.patient_organization_id ? x.patient_organization_id : null,
            is_double_mr: x.is_double_mr ? x.is_double_mr : false,
            payment_status_id: x.payment_status_id ? x.payment_status_id : '',
            bpjs_card_file: x.bpjs_card_file? x.bpjs_card_file : '',
            identity_card_file: x.identity_card_file? x.identity_card_file : '',
            family_card_file: x.family_card_file? x.family_card_file : '',
            refference_letter_file: x.refference_letter_file? x.refference_letter_file : '',
            selfie_with_identity_file: x.selfie_with_identity_file? x.selfie_with_identity_file : ''
          });
        }
      });

        let nextWlNo = 0;
        nextWlNo = this.appListWaiting[k].appointment.length === 0 ? 
          nextWlNo : Math.max.apply(Math, this.appListWaiting[k].appointment.map(function (o) { return o.appointment_no }));
        this.appListWaiting[k].appointment.push({
          no: no + 1,
          hospital_id: hospitalId,
          doctor_id: doctorId,
          doctor_name: doctorName,
          appointment_range_time: this.appListWaiting[k].appointment.length > 0 ? '' : appTime,
          appointment_from_time: fromTime,
          appointment_to_time: toTime,
          appointment_no: this.appListWaiting[k].appointment.length === 0 ? this.appList[k].appointment.length : nextWlNo + 1,
          appointment_id: null,
          appointment_date: null,
          appointment_temp_id: null,
          admission_id: null,
          patient_name: null,
          contact_id: null,
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
          schedule_id: this.schedule[k].schedule_id,
          doctor_type_id: this.schedule[k].doctor_type_id,
          channel_id: null,
          admission_status_id: null,
          appointment_status_id: null,
          patient_hope_id: null,
          patient_organization_id: null,
          is_double_mr: false,
          payment_status_id: '',
          bpjs_card_file: '',
          identity_card_file: '',
          family_card_file: '',
          refference_letter_file: '',
          selfie_with_identity_file: ''
        });  
      } else {
        for (let i = 0, { length } = this.appointments; i < length; i++) {
          no += 1;
          if(this.appList[k].schedule_id === this.appointments[i].schedule_id) {
            this.appList[k].appointment.push({
              no: no,
              hospital_id: hospitalId,
              doctor_id: doctorId,
              doctor_name: doctorName,
              appointment_range_time: appTime,
              appointment_from_time: fromTime,
              appointment_to_time: toTime,
              appointment_id: this.appointments[i].appointment_id,
              appointment_temp_id: this.appointments[i].appointment_temporary_id,
              admission_id: this.appointments[i].admission_id,
              appointment_no: this.appointments[i].appointment_no,
              patient_name: this.appointments[i].contact_name,
              contact_id: this.appointments[i].contact_id,
              date_of_birth: moment(this.appointments[i].birth_date).format('DD-MM-YYYY'),
              local_mr_no: this.appointments[i].medical_record_number,
              phone_no: this.appointments[i].phone_number,
              queue_no: this.appointments[i].queue_number,
              note: this.appointments[i].appointment_note ? this.appointments[i].appointment_note : '',
              note_long: this.appointments[i].appointment_note ? this.appointments[i].appointment_note : '',
              note_short: this.appointments[i].appointment_note && this.appointments[i].appointment_note.length > 30 ? this.appointments[i].appointment_note.substr(0, 30) + '...' : this.appointments[i].appointment_note,
              modified_name: this.appointments[i].modified_name,
              modified_by: this.appointments[i].modified_by,
              is_waiting_list: false,
              is_can_create: false,
              is_can_cancel: true,
              is_blocked: false,
              is_walkin: false,
              is_reserved_slot: false,
              schedule_id: this.schedule[k].schedule_id,
              doctor_type_id: this.schedule[k].doctor_type_id,
              channel_id: this.appointments[i].channel_id ? this.appointments[i].channel_id : null,
              admission_status_id: this.appointments[i].admission_status_id ? this.appointments[i].admission_status_id : null,
              appointment_status_id: this.appointments[i].appointment_status_id ? this.appointments[i].appointment_status_id : null,
              patient_hope_id: this.appointments[i].patient_hope_id ? this.appointments[i].patient_hope_id : null,
              patient_organization_id: this.appointments[i].patient_organization_id ? this.appointments[i].patient_organization_id : null,
              is_double_mr: this.appointments[i].is_double_mr ? this.appointments[i].is_double_mr : false,
              payment_status_id: this.appointments[i].payment_status_id ? this.appointments[i].payment_status_id : '',
              bpjs_card_file: this.appointments[i].bpjs_card_file ? this.appointments[i].bpjs_card_file : '',
              identity_card_file: this.appointments[i].identity_card_file ? this.appointments[i].identity_card_file : '',
              family_card_file: this.appointments[i].family_card_file ? this.appointments[i].family_card_file : '',
              refference_letter_file: this.appointments[i].refference_letter_file ? this.appointments[i].refference_letter_file : '',
              selfie_with_identity_file: this.appointments[i].selfie_with_identity_file ? this.appointments[i].selfie_with_identity_file : '',
            });
          }
        }

        let numberL;
        numberL = this.appList[k].appointment.length > 0 ? 
        Math.max.apply(Math, this.appList[k].appointment.map(i => i.appointment_no)) : 0;
        const appListLength = numberL;
        no += 1;

        this.appList[k].appointment.push({
          no: no,
          hospital_id: hospitalId,
          doctor_id: doctorId,
          doctor_name: doctorName,
          appointment_range_time: appListLength > 0 ? '' : appTime,
          appointment_from_time: fromTime,
          appointment_to_time: toTime,
          appointment_id: null,
          appointment_temp_id: null,
          admission_id: null,
          appointment_no: this.appointments.length > 0 ? numberL + 1 : 0,
          patient_name: null,
          contact_id: null,
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
          is_reserved_slot: false,
          schedule_id: this.schedule[k].schedule_id,
          doctor_type_id: this.schedule[k].doctor_type_id,
          channel_id: null,
          admission_status_id: null,
          appointment_status_id: null,
          patient_hope_id: null,
          patient_organization_id: null,
          is_double_mr: false,
          payment_status_id: '',
          bpjs_card_file: '',
          identity_card_file: '',
          family_card_file: '',
          refference_letter_file: '',
          selfie_with_identity_file: ''
        });
      } 
    }

  }

  async getAppointmentList() {
    const doctorId = this.appointmentPayload.doctorId;
    const hospitalId = this.hospital.id;
    const date = this.appointmentPayload.appointmentDate;
    const sortBy = 'appointment_no';
    const orderBy = 'ASC';
    await this.appointmentService.getAppointmentByDay(hospitalId, doctorId, date, sortBy, orderBy).toPromise().then(
      data => {
        this.appointments = data.data;
      }
    );
  }

  async getSlotTime() {
    //get time slot
    const doctorId = this.appointmentPayload.doctorId;
    const date = this.appointmentPayload.appointmentDate;
    const hospitalId = this.hospital.id;
    const consulTypeAll = consultationType.REGULAR+':'+consultationType.EXECUTIVE+':'
      +consultationType.TELECONSULTATION+':'+consultationType.BPJS_REGULER+':'+consultationType.NON_BPJS_TELE;
    let consulTypeList = this.fromBpjs === true ? this.consulType : consulTypeAll;
    if(this.reschBpjs === true) consulTypeList = this.consulType; // reschedule bpjs
    await this.scheduleService.getTimeSlot(hospitalId, doctorId, date, consulTypeList).toPromise().then(
      data => {
        this.slotList = data.data;
        if(this.fromBpjs === true) {
          this.slotList.map(x => {
            if(x.consultation_type_id === consultationType.BPJS) {
              x.is_walkin = false;
            }
          });
        }
      }
    );
  }

  async getDoctorProfile() {
    const hospitalId = this.hospital.id;
    const doctorId = this.appointmentPayload.doctorId;
    const date = this.appointmentPayload.appointmentDate;
    await this.doctorService.getDoctorProfile(hospitalId, doctorId, date).toPromise().then(
      data => {
        this.doctorProfile = data.data;
      }
    );
  }

  async getDoctorNotes() {
    const hospitalId = this.hospital.id;
    const doctorId = this.appointmentPayload.doctorId;
    const fromDate = this.appointmentPayload.appointmentDate;
    const toDate = fromDate;
    await this.doctorService.getDoctorNotes(hospitalId, fromDate, toDate, doctorId).toPromise().then(
      data => {
        if(data.data.length === 0) {
          this.doctorNotes = null;
        } else {
          this.doctorNotes = data.data;
        }
      }
    );
  }

  openRescheduleModal(appointmentSelected: any) {
    if(appointmentSelected.channel_id === channelId.BPJS) {
      const modalRef = this.modalService.open( ModalAppointmentBpjsComponent,
      { windowClass: 'cc_modal_confirmation', size: 'lg' });
    modalRef.componentInstance.appointmentSelected = appointmentSelected;
    } else {
      const modalRef = this.modalService.open(ModalRescheduleAppointmentComponent,
        { windowClass: 'cc_modal_confirmation', size: 'lg' });
      modalRef.componentInstance.appointmentSelected = appointmentSelected;
    }
  }

  async getSchedule() {
    const doctorId = this.appointmentPayload.doctorId;
    const date = this.appointmentPayload.appointmentDate;
    const consulTypeAll = consultationType.REGULAR+':'+consultationType.EXECUTIVE+':'
      +consultationType.TELECONSULTATION+':'+consultationType.BPJS_REGULER+':'+consultationType.NON_BPJS_TELE;
    let consulTypeList = this.fromBpjs === true ? this.consulType : consulTypeAll;
    if(this.reschBpjs === true) consulTypeList = this.consulType; // reschedule bpjs
    await this.scheduleService.getScheduleDoctor(this.hospital.id, doctorId, date, consulTypeList).toPromise().then(
      data => {
        this.schedule = data.data;
        this.schedule.map(x => {
          x.from_time = x.from_time.substr(0, 5);
          x.to_time = x.to_time.substr(0, 5);
        });
        this.doctorName = this.schedule[0].doctor_name;
        this.hospitalName = this.schedule[0].hospital_name;
      }
    );
  }

  async verifyAppointment(appointmentId: string, temp = false) {
    await this.appointmentService.getTempAppointment(appointmentId).toPromise().then(
      data => {
        this.detailTemp = data.data;
        const modalRef = this.modalService.open(ModalPatientVerificationComponent, { windowClass: 'modal_verification', size: 'lg' });
        modalRef.componentInstance.tempAppointmentSelected = this.detailTemp;
      }
    );
  }

  confirmCancelAppointment(appointmentId: string, temp = false) {
    const modalRef = this.modalService.open(ModalCancelAppointmentComponent);
    const payload = { appointmentId: appointmentId, temp: temp };
    modalRef.componentInstance.payload = payload;
  }

  async createAppBPJSOnly(item: any) {
    const canReserved = await this.getReservedSlot(item);
    if(canReserved.key === null) {
      await this.reserveSlotApp(item);
    }
    const fromTime = item.appointment_from_time ? item.appointment_from_time : item.schedule_from_time; 
    const toTime = item.appointment_to_time ? item.appointment_to_time : item.schedule_to_time;
    const data = {
      schedule_id: item.schedule_id,
      appointment_date: this.appointmentPayload.appointmentDate,
      appointment_from_time: fromTime,
      appointment_to_time: toTime,
      hospital_id: item.hospital_id,
      doctor_id: item.doctor_id,
      appointment_no: item.appointment_no,
      is_waiting_list: item.is_waiting_list,
      can_reserved: canReserved,
      doctor_type_id: item.doctor_type_id,
      ...this.bodyBpjs
    };
    const modalRef = this.modalService.open(ModalCreateAppBpjsComponent);
    modalRef.componentInstance.bpjsInfo = data;
  }

  async openCreateAppModal(item: any) {
    const canReserved = await this.getReservedSlot(item);
    if(canReserved.key === null) {
      await this.reserveSlotApp(item);
    }
    const fromTime = item.appointment_from_time ? item.appointment_from_time : item.schedule_from_time; 
    const toTime = item.appointment_to_time ? item.appointment_to_time : item.schedule_to_time;
    const data = {
      schedule_id: item.schedule_id,
      appointment_date: this.appointmentPayload.appointmentDate,
      appointment_from_time: fromTime,
      appointment_to_time: toTime,
      hospital_id: item.hospital_id,
      doctor_id: item.doctor_id,
      appointment_no: item.appointment_no,
      is_waiting_list: item.is_waiting_list,
      can_reserved: canReserved,
      doctor_type_id: item.doctor_type_id
    };
    const modalRef = this.modalService.open(ModalCreateAppointmentComponent);
    modalRef.componentInstance.appointmentInfo = data;
  }

  public reschCurrentIdx: any;
  async openCreateAppModal2(item: any) {
    const canReserved = await this.getReservedSlot(item);
    if(canReserved.key === null) {
      await this.reserveSlotApp(item);
    }
    const fromTime = item.appointment_from_time ? item.appointment_from_time : item.schedule_from_time;
    const toTime = item.appointment_to_time ? item.appointment_to_time : item.schedule_to_time;
    const data = {
      schedule_id: item.schedule_id,
      appointment_date: this.appointmentPayload.appointmentDate,
      appointment_from_time: fromTime,
      appointment_to_time: toTime,
      hospital_id: item.hospital_id,
      doctor_id: item.doctor_id,
      appointment_no: item.appointment_no,
      is_waiting_list: item.is_waiting_list,
      can_reserved: canReserved,
      doctor_type_id: item.doctor_type_id
    };

    let idx;
    idx = this.reschCurrentIdx;
    for(let k = 0, { length } = this.schedule; k < length; k += 1) {
      if(this.schedule[k].schedule_id === this.scheduleTemp) {
        if (idx) { //delete slot name when do move slot
          if (idx.is_waiting_list) {
            this.appListWaiting[k].appointment.map(x => {
              if (x.appointment_no === idx.appointment_no) {
                x.patient_name = null;
                x.is_can_create = true;
              }
            });
          } else {
            if (this.schedule[k].doctor_type_id === '1') { //first come first serve
              this.appList[k].appointment.map(x => {
                if (x.appointment_no === idx.appointment_no) {
                  x.patient_name = null;
                  x.is_can_create = true;
                }
              });
            } else {
              this.appList[k].appointment[idx.appointment_no].patient_name = null;
              this.appList[k].appointment[idx.appointment_no].is_can_create = true;
            }
          }
        }
      }
    }

    idx = item;
    this.reschCurrentIdx = idx;
    for(let k = 0, { length } = this.schedule; k < length; k += 1) {
      if(this.schedule[k].schedule_id === idx.schedule_id) {
        if (idx.is_waiting_list) { //take slot with name in waiting list
          this.scheduleTemp = idx.schedule_id;
          this.appListWaiting[k].appointment.map(x => {
            if (x.appointment_no === idx.appointment_no) {
              x.patient_name = this.appointmentPayloadInput.name;
              x.is_can_create = false;
            }
          });
        } else { //take slot with name
          this.scheduleTemp = idx.schedule_id;
          if (this.schedule[k].doctor_type_id === '1') {  //first come first serve
            this.appList[k].appointment.map(x => {
              if (x.appointment_no === idx.appointment_no) {
                x.patient_name = this.appointmentPayloadInput.name;
                x.is_can_create = false;
              }
            });
          } else {
            this.appList[k].appointment[idx.appointment_no].patient_name = this.appointmentPayloadInput.name;
            this.appList[k].appointment[idx.appointment_no].is_can_create = false;
          }
        }
      }
    }

    this.opSlotSelected.emit(data);
  }

  async reserveSlotApp(app: any) {
    let channel = this.reschBpjs === true || this.fromBpjs === true ? 
      channelId.BPJS : channelId.FRONT_OFFICE;
    const payload: reserveSlotPayload = {
      scheduleId: app.schedule_id,
      appointmentDate: this.appointmentPayload.appointmentDate,
      appointmentNo: app.appointment_no,
      channelId: channel,
      userId: this.userId,
      source: this.source
    };

    await this.appointmentService.reserveSlotApp(payload).toPromise().then(
      data => {
        return data.data;
      }
    );
  }

  async checkInAppointment(app, content) {
    await this.appointmentService.getAppointmentById(app.appointment_id).subscribe(
      data => {
        this.selectedCheckIn = data.data[0];
        this.selectedCheckIn.custome_birth_date = dateFormatter(this.selectedCheckIn.birth_date, true);
      }
    );

    //if doctor type is not firstcome, check patient is late or not
    if(app.doctor_type_id !== '1'){
      this.late = await this.checkIsLate(app.appointment_id);
    }else{
      this.late = '';
    }
    this.open(content);
  }

  async checkInBpjsApp(app, content) {
    await this.refreshDataApp(app.appointment_id);
    //if doctor type is not firstcome, check patient is late or not
    if(app.doctor_type_id !== '1'){
      this.late = await this.checkIsLate(app.appointment_id);
    }else{
      this.late = '';
    }
    this.open(content);
  }

  async refreshDataApp(appointment){
    await this.appointmentService.getAppointmentById(appointment).subscribe(
      data => {
        this.selectedCheckIn = data.data[0];
        this.selectedCheckIn.custome_birth_date = dateFormatter(this.selectedCheckIn.birth_date, true);
      }
    );
  }

  getImage(fileName) {
    let split = fileName.split('-');
    let pathFile = split[0];
    window.open(this.urlBpjsCard +'/'+ pathFile +'/'+ fileName, '_blank', "status=1");
  }

  checkIsLate(appointmentId: string) {
    const msg = this.appointmentService.isLate(appointmentId)
      .toPromise().then(res => {
        if (res.data) {
          return `${res.data.hours} Jam, ${res.data.minutes} Menit, ${res.data.seconds} Detik!!`;
        } else {
          return '';
        }
      }).catch(err => {
        return '';
      })
    return msg;
  }

  async defaultPatientType(patientHopeId: any) {
    this.nationalIdTypeId = await this.patientService.getDefaultPatientType(patientHopeId).toPromise()
      .then(res => {
        if (res.data) {
          if(res.data.nationalIdTypeId === null) {
            return '';
          } else {
            return res.data.nationalIdTypeId;
          }
        } else {
          return '';
        }
      }).catch(err => {
        return '';
      })

    let idx = null;
    if (this.nationalIdTypeId && this.fromBpjs === false) {
      if (this.nationalIdTypeId == 3) {
        //Passport
        idx = this.patientTypeList.findIndex((a) => {
          return a.description == "PASSPORT";
        })
      } else if (this.nationalIdTypeId == 4) {
        //KITAS
        idx = this.patientTypeList.findIndex((a) => {
          return a.description == "KITAS";
        })
      } else {
        //Private
        idx = this.patientTypeList.findIndex((a) => {
          return a.description == "PRIVATE";
        })
      }
    } else if(this.nationalIdTypeId && this.fromBpjs === true) {
      this.txtPayer = false;
      this.txtPayerNo = false;
      // this.txtPayerEligibility = false;
      this.payerNo = this.selectedCheckIn.bpjs_card_number;
      idx = this.patientTypeList.findIndex((a) => {
        return a.description == "PAYER";
      })
    } else {
      if(this.fromBpjs === true) {
        this.txtPayer = false;
        this.txtPayerNo = false;
        // this.txtPayerEligibility = false;
        this.payerNo = this.selectedCheckIn.bpjs_card_number;
        idx = this.patientTypeList.findIndex((a) => {
          return a.description == "PAYER";
        })
      } else {
        idx = this.patientTypeList.findIndex((a) => {
          return a.description == "PRIVATE";
        })
      }
    }
    this.patientType = this.patientTypeList[idx];
  }

  async confirmCheckInValue(detail, checkInModal, mrLocalModal) {
    this.nationalIdTypeId = '';
    let now = dateFormatter(new Date(), true);
    let appDate = dateFormatter(detail.appointment_date, true);

    if (now !== appDate) {
      this.alertService.error('This appointment cannot checkin in this day', false, 3000);
    } else {
      this.getNotesAndEmail(detail.contact_id);
      if (!detail.medical_record_number) {
        if (detail.patient_hope_id) {
          this.open(mrLocalModal);
        } else {
          let params;
          if(this.fromBpjs === true) {
            params = {
              appointmentId: detail.appointment_id,
              fromBpjs: this.fromBpjs,
              fromRegistration: this.fromRegistration
            };
          } else {
            params = {
              appointmentId: detail.appointment_id,
            };
          }

          this.router.navigate(['./patient-data'], { queryParams: params });
        }
      } else {
        await this.defaultPatientType(detail.patient_hope_id);
        if(this.fromBpjs === true) {
          this.checkListModel = {
            checkOne: false, checkTwo: false, checkThree: false,
            checkFour: false, checkFive: false
          }
          this.closeDocument = checkInModal;
          this.modalService.open(checkInModal, { windowClass: 'fo_modal_admission_3', size: 'lg' });
        } else {
          this.open50(checkInModal);
        }
      }
    }
  }

  async getNotesAndEmail(contactId) {
    await this.patientService.getNotesAndEmailPatient(contactId).toPromise().then(res => {
      this.email = res.data.email_address;
      this.emailTemp = res.data.email_address;
      this.notes = res.data.notes;
      this.notesTemp = res.data.notes;
      this.isSigned = res.data.is_signed;
      this.isSignedTemp = res.data.is_signed;
    }).catch(err => {
      this.email = null;
      this.notes = null;
    });
  }

  async editNotesAndEmail(payload, contactId) {
    await this.patientService.editNotesAndEmailPatient(payload, contactId).toPromise().then(res => {
      return res.data;
    }).catch(err => {
      this.alertService.error(err.error.message);
      return null;
    });
  }

  getActiveAdmission(patientHopeId: any) {
    const active = this.admissionService.getActiveAdmission(patientHopeId)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        return [];
      });
    return active;
  }

  async createAdmission(val, activeModal) {
    this.buttonCreateAdmission = true;

    this.listActiveAdmission = await this.getActiveAdmission(val.patient_hope_id);
    if (this.listActiveAdmission.length !== 0) {
      this.openconfirmation(activeModal);
    } else {
      this.processCreateAdmission(val);
    }
  }

  mrLocalProcess(payload: any) {
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

  async buildMrLocal(detail, close, modal, modalDoc) {
    const body = {
      patientHopeId: Number(detail.patient_hope_id),
      organizationId: Number(this.hospital.orgId),
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.fullname,
    }

    this.resMrLocal = await this.mrLocalProcess(body);

    if (this.resMrLocal) {
      this.selectedCheckIn.medical_record_number = this.resMrLocal.medical_record_number;
      this.selectedCheckIn.patient_organization_id = this.resMrLocal.patient_organization_id;
      await this.defaultPatientType(detail.patient_hope_id);
      await this.getAppointmentList();
      await this.dataProcessing();
      close.click();
      if(this.selectedCheckIn.channel_id === channelId.BPJS) {
        this.modalService.open(modalDoc, { windowClass: 'fo_modal_admission_3', size: 'lg' });
      } else {
        this.open50(modal);
      }
    }
  }

  async createMrModal(val: any, content: any){
    this.selectedApp = val;
    this.open(content);
  }

  async processCreateMrLocal(){
    const body = {
      patientHopeId: this.selectedApp.patient_hope_id,
      organizationId: Number(this.hospital.orgId),
      channelId: channelId.AIDO, 
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.fullname,
    };
    
    const resMrLocal = await this.mrLocalProcess(body);

    if(resMrLocal){
      await this.getAppointmentList();
      await this.dataProcessing();
    }
  }

  processAdmissionTeleconsultation(payload: any) {
    const admissionTele = this.admissionService.createAdmissionAido(payload)
      .toPromise().then(res => {
        this.alertService.success(res.message, false, 3000);
        return res.data;
      }).catch(err => {
        this.alertService.error(err.error.message, false, 3000);
        return null;
      })

    return admissionTele;
  }

  async createAdmModal(val, content) {
    this.selectedAdm = {
      appointmentId: val.appointment_id,
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.fullname
    }
    this.open(content);
  }

  async createAdmTeleconsultation() {
    const resAdmissionTele = await this.processAdmissionTeleconsultation(this.selectedAdm);

    if(resAdmissionTele){
      await this.getAppointmentList();
      await this.dataProcessing();
    }
  }

  async verifyAppointmentTele(data) {
    const parameter = {
      from_worklist: false,
      ...data,
    };

    const modalRef = this.modalService.open(ModalVerificationAidoComponent, { windowClass: 'modal_verification', size: 'lg' });
        modalRef.componentInstance.appointmentAidoSelected = parameter;
  }

  checkInValidate(){
    let params = { valid: true, msg: '' };

    if (!this.patientType) {
      params.valid = false;
      params.msg = `Select Patient Type First`;
    }

    if (this.patientType.description === 'PAYER') {
      if (!this.payer || !this.payer.payer_id) {
        params.valid = false;
        params.msg = `Please Input Payer First`;
      }
    }

    return params;
  }

  processCreateAdmission(val) {
    // Show loading bar
    this.buttonCreateAdmission = true;
    this.isLoadingCreateAdmission = true;
  

    let payer = null;
    let payerNo = null;
    let payerEligibility = null;
    let procedureRoomId = this.roomHope ? this.roomHope.procedureRoomId : null;

    //check condition in checkin validate
    let params = this.checkInValidate();

    if(!params.valid){
      this.alertService.error(params.msg, false, 3000);
      this.buttonCreateAdmission = false;
      this.isLoadingCreateAdmission = false;
    }else{
      if (this.patientType.description === 'PAYER') {
        if (this.payer && this.payer.payer_id) {
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
        procedureRoomId: procedureRoomId,
        userId: this.user.id,
        source: sourceApps,
        userName: this.user.fullname,
      };

      if(this.notes !== this.notesTemp 
        || this.email !== this.emailTemp
        || this.isSigned !== this.isSignedTemp) {
        const modifyNotesEmail = {
          patientOrganizationId: val.patient_organization_id,
          organizationId: Number(this.hospital.orgId),
          emailAddress: this.email,
          notes: this.notes,
          isSigned: this.isSigned,
          source: sourceApps,
          userName: this.user.fullname,
          userId: this.user.id
        }
        this.editNotesAndEmail(modifyNotesEmail, val.contact_id);
      }

      var dataPatient;
      this.admissionService.createAdmission(body).toPromise()
        .then(res => {
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
          dataPatient.hospitalId = this.hospital.id;
          this.socket.emit(CHECK_IN, dataPatient);
          this.buttonCreateAdmission = true;
          this.buttonPrintQueue = false;
          this.buttonCloseAdm = true;
          this.buttonPatientLabel = false;
          this.isLoadingCreateAdmission = false;
          this.alertService.success(res.message, false, 3000);
        }).catch(err => {
          this.buttonCreateAdmission = false;
          this.isLoadingCreateAdmission = false;
          this.alertService.error(err.error.message, false, 3000);
        })
    }
  }

  async printPatientLabel(val) {
    const contentPdf = await this.admissionService.getPatientLabel(val.appointment_id).toPromise()
      .then(res => {
        return res.data;
      }).catch(err => {
        return null;
      })

    if (contentPdf) {
      await this.filePdfCreated(contentPdf);
    } else {
      this.alertService.error('Cannot print patient label', false, 3000);
    }
  }

  changeCondition(event: any) {
    const val = event.target.value;
    let idx = null

    if (val == 'PRIVATE' || val == 'PASSPORT' || val == 'KITAS') {
      this.txtPayer = true;
      this.txtPayerNo = true;
      this.txtPayerEligibility = true;
      this.buttonCheckEligible = true;

      this.payer = null;
      this.payerNo = null;
      this.payerEligibility = null;

      if (val == 'PRIVATE') {
        idx = this.patientTypeList.findIndex((a) => {
          return a.description == "PRIVATE";
        })
      } else if (val == 'KITAS') {
        idx = this.patientTypeList.findIndex((a) => {
          return a.description == "KITAS";
        })
      } else if (val == 'PASSPORT') {
        idx = this.patientTypeList.findIndex((a) => {
          return a.description == "PASSPORT";
        })
      }
    } else {
      this.txtPayer = false;
      this.txtPayerNo = false;
      // this.txtPayerEligibility = false;
      this.buttonCheckEligible = false;
      idx = this.patientTypeList.findIndex((a) => {
        return a.description == "PAYER";
      })
    }

    this.patientType = this.patientTypeList[idx];
  }

  filePdfCreated(val) {
    const {
      patientName, sex, phone, admissionNo, admissionDate,
      alias, mrNoFormatted, barcode, age, admissionTime,
      doctorName, payer, patientType, labelBirth,
    } = val;

    const detailPayer = payer ? payer : patientType;
    const strName = patientName.toUpperCase();
    const strAge = age.toLowerCase();
    let doctorPayer = doctorName + ' / ' + detailPayer;
    doctorPayer = doctorPayer.substr(0, 55);

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const docDefinition = {
      pageSize: { width: 292.283, height: 98.031 },
      pageMargins: [0, 0, 0, 0],
      content: [
        { text: strName, style: 'header', bold: true, fontSize: 10, noWrap: true },
        { text: 'Sex: ' + sex + ' / Ph: ' + phone, style: 'header', bold: true, fontSize: 10, noWrap: true },
        { text: 'MR No: ' + alias + '.' + mrNoFormatted + ' / DOB: ' + labelBirth + ' (' + strAge + ') ', style: 'header', bold: true, fontSize: 10 },
        { text: admissionNo + ' ' + admissionDate + ' ' + admissionTime, style: 'header', fontSize: 9 },
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


  printQueue(content, close) {
    if(this.selectedCheckIn.channel_id === channelId.BPJS) this.buttonVIP = true;
    else this.buttonVIP = false;

    this.modalService.open(content, { windowClass: 'modal_queue', size: 'lg' });
    this.closeAdm = close;
  }

  afterUploadCheckIn(content, close) {
    this.open50(content);
    this.closeDocument = close;
  }

  async printQueueAction(val, isReguler, content) {
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
      }).catch(err => {
        return null;
      });

    var dataPatient;

    this.resQueue = await this.queueService.createQueue(body).toPromise()
      .then(res => {
        this.buttonReguler = false;
        this.buttonVIP = false;
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
        dataPatient.hospitalId = this.hospital.id;
        this.socketTwo.emit(QUEUE_NUMBER, dataPatient);
        return res.data;
      }).catch(err => {
        this.buttonReguler = false;
        this.buttonVIP = false;
        this.alertService.error(err.error.message, false, 3000);
        return null;
      })

    this.selectedCheckIn = await this.appointmentService.getAppointmentById(val.appointment_id).toPromise().then(res => {
      return res.data[0];
    }).catch(err => {
      return null;
    });
  }

  newPatient() {
    const params = { appointmentId: this.selectedCheckIn.appointment_id, };
    this.router.navigate(['./patient-data'], { queryParams: params });
  }

  printQueueTicket(val) {

    const queueNo = this.resQueue.name;
    const isWalkin = this.selectedCheckIn.is_walkin ? 'WALK IN' : 'APPOINTMENT';
    const patientName = val.contact_name;
    const doctorName = val.doctor_name;

    let floor = '';
    let wing = '';
    let room = '';

    if (this.roomDetail) {
      floor = this.roomDetail.floor_name ? this.roomDetail.floor_name : floor;
      wing = this.roomDetail.wing_name ? this.roomDetail.wing_name : wing;
      room = this.roomDetail.room_name ? this.roomDetail.room_name : room;
    }

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const docDefinition = {
      pageSize: { width: 252.283, height: 200 },
      pageMargins: [0, 10, 10, 10],
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
          fontSize: 30,
          margin: [0, 5, 0, 5]
        },
        {
          text: 'Floor : ' + floor + ' , Wing : ' + wing + ' , Room : ' + room,
          margin: [0, 0, 0, 0],
          alignment: 'center',
          fontSize: 10,
          bold: true
        },
        {
          text: 'Patient Name : ' + patientName,
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 10
        },
        {
          text: 'Doctor Name : ' + doctorName,
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

    setTimeout(() => {
      this.closeQue.click();
      this.closeAdm.click();
      if(this.fromBpjs === true) {
        this.closeDocument.click();
      }
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
    this.modalService.open(content, { windowClass: 'fo_modal_confirmation' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open50(content) {
    this.modalService.open(content, { windowClass: 'fo_modal_admission' }).result.then((result) => {
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
      return `with: ${reason}`;
    }
  }

  async getReservedSlot(app: any) {
    const scheduleId = app.schedule_id;
    const appointmentDate = this.appointmentPayload.appointmentDate;
    const appointmentNo = app.appointment_no;
    const userId = this.userId;
    let channel = this.reschBpjs === true || this.fromBpjs === true ? 
      channelId.BPJS : channelId.FRONT_OFFICE;
    const result = await this.appointmentService.getReservedSlotApp(
      scheduleId,
      appointmentDate,
      appointmentNo,
      userId,
      channel
    ).toPromise().then(
      data => {
        return data.data;
      }
    );
    return result;
  }

  prevPage() {
    const searchKey = JSON.parse(localStorage.getItem('searchKey'));
    this.router.navigate(['./base-appointment'], { queryParams: searchKey });
  }

  prevPageTwo() {
    if(this.fromBpjs === true && this.fromRegistration === false) {
      this.doctorService.searchDoctorSource2 = this.bodyBpjs;
      const searchKey = JSON.parse(localStorage.getItem('searchKey'));
      this.router.navigate(['./bpjs-registration'], { queryParams: searchKey });
    } else if(this.fromBpjs === true && this.fromRegistration === true) {
      const searchKey = JSON.parse(localStorage.getItem('searchKey'));
      this.router.navigate(['./bpjs-registration'], { queryParams: searchKey });
    }
  }

  openScheduleBlockModal() {
    const params = {
      scheduleId: this.schedule,
      doctorId: this.appointmentPayload.doctorId,
      date: this.appointmentPayload.appointmentDate
    };
    const modalRef = this.modalService.open(ModalScheduleBlockComponent, { windowClass: 'cc_modal_block' });
    modalRef.componentInstance.inputedParams = params;
  }

  async getScheduleBlock() {
    const { appointmentDate, doctorId } = this.appointmentPayload;
    await this.scheduleService.getScheduleBlockByDay(this.hospital.id, doctorId, appointmentDate).toPromise().then(
      data => {
        this.scheduleBlocks = data.data;
        this.scheduleBlocks.map(x => {
          x.from_time = x.from_time.substr(0, 5);
          x.to_time = x.to_time.substr(0, 5);
        });
      }
    );
  }

  emitCreateApp() {
    this.appointmentService.createAppSource$.subscribe(
      async () => {
        if(this.fromBpjs === true && this.fromRegistration === false) {
          this.doctorService.searchDoctorSource2 = null;
          this.patFromBpjs = null;
          this.flagCreateNewApp = true;
          this.bodyBpjs.fromRegistration = true;
          this.bodyBpjs.patientBpjs = null;
        }
        await this.getAppointmentList();
        await this.dataProcessing();
      }
    );
  }

  emitCancelApp() {
    this.appointmentService.cancelAppSource$.subscribe(
      async () => {
        await this.getAppointmentList();
        await this.dataProcessing();
      }
    );
  }

  emitScheduleBlock() {
    this.scheduleService.scheduleBlockSource$.subscribe(
      async () => {
        await this.getScheduleBlock();
        await this.getAppointmentList();
        await this.getSlotTime();
        await this.dataProcessing();
      }
    );
  }

  async checkEligible(){
    let payload = {
      organizationId: this.payer.organization_id,
      payerId: this.payer.payer_id,
      payerIdNo:this.payerNo,
      doctorId: this.selectedCheckIn.doctor_id,
      userName: this.user.username,
      userId: this.userId,
      appointmentId: this.selectedCheckIn.appointment_id
    }

    let data = await this.payerService.checkEligible(payload)
    .toPromise().then(
      res => {
        this.alertService.success('Patient Eligible', false, 5000)
        this.payerEligibility = res.data.eligibility_no
        this.txtPayerEligibility = false;
        this.patientEligible = res.data
      }
    )
    .catch(err => {
      this.txtPayerEligibility = false;
      this.alertService.error(err.error.message,false,5000)
    })

  }

 async onKeyDiagnose(event: any){
  this.keyword = event.target.value
  if (this.keyword.length >= 3){
    this.getDiagnose()
  }
 }

 async onReferralKey(event: any){
    this.keyword = event.target.value
    if (this.keyword.length >= 3 && this.payer){
      // let input1 = document.querySelector('#input1')
          this.getReferralSource();
          // this.inputList = false;
          // if (input1 !== null){
          //   input1.remove()
          // }
          
    // } else if (this.keyword.length < 1) {
    //     this.inputList = true;
    //     let input2 = document.querySelector('#input2')
    //     if (input2 !== null){
    //       input2.remove()
    //     }
       
    }


  }

  printSjp(){

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const docDefinition = {
      pageSize: { width: 252.283, height: 200 },
      pageMargins: [0, 10, 10, 10],
      content: [
        {
          text: 'Your Queue Number',
          style: 'header',
          fontSize: 12,
          margin: [0, 0, 0, 0]
        },
        {
          image:  'data:image/jpeg;base64,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NTc4IDg4OSA2MDQgNTc1IDUyNSA2MjMgNjM2IDYyMyA4MTggNTAwIDYzNiA1MDAgMjc1IDYzNiA0ODkgMTAwMCA2MzYgNjM2IDU0NSAxNjc1IDYzMyA0MjQgMTAzNiA1MDAgNjIyIDUwMCA1MDAgMjc1IDI3NSA0ODkgNDg5IDYzNiA2MzYgOTA5IDU0NSA4NjAgNTE0IDQyNCA5ODUgNTAwIDUyNSA2NzAgMjkyIDM0MiA2MzYgNjM2IDYzNiA2MzYgNjM2IDYzNiA1NDUgOTI4IDUwNyA3MDMgODE4IDQzMSA5MjggNjM2IDUxOSA4MTggNTM5IDUzOSA1NDUgNjUwIDYzNiAzNjMgNTQ1IDUzOSA1MzkgNzAzIDExMjcgMTEyNyAxMTI3IDU2NiA2ODQgNjg0IDY4NCA2ODQgNjg0IDY4NCA5ODggNjY3IDYxNSA2MTUgNjE1IDYxNSA0ODMgNDgzIDQ4MyA0ODMgNzczIDc3MCA3NzAgNzcwIDc3MCA3NzAgNzcwIDgxOCA3NzAgNzM4IDczOCA3MzggNzM4IDY3MCA2NTkgNjQ1IDU5OCA1OTggNTk4IDU5OCA1OTggNTk4IDkzNyA1MjcgNTkzIDU5MyA1OTMgNTkzIDMwMSAzMDEgMzAxIDMwMSA2MTkgNjQwIDYxNyA2MTcgNjE3IDYxNyA2MTcgODE4IDYxNyA2NDAgNjQwIDY0MCA2NDAgNTc1IDYyOSA1NzUgXSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvQmFzZUZvbnQgL0FCQ0RFRStUYWhvbWEsQm9sZCAvRm9udERlc2NyaXB0b3IgMTAgMCBSID4+DQplbmRvYmoNCjEwIDAgb2JqDQo8PCAvVHlwZSAvRm9udERlc2NyaXB0b3IgL0FzY2VudCA3NjUgL0NhcEhlaWdodCAwIC9EZXNjZW50IC0yMDcgL0ZsYWdzIDMyIC9Gb250QkJveCBbIC02OTggLTQxOSAyMTk2IDEwNjUgXSAvRm9udE5hbWUgL0FCQ0RFRStUYWhvbWEsQm9sZCAvSXRhbGljQW5nbGUgMCAvU3RlbVYgMCAgL0ZvbnRGaWxlMiA4ICAwIFIgPj4NCmVuZG9iag0KNSAwIG9iag0KPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1RydWVUeXBlIC9GaXJzdENoYXIgMCAvTGFzdENoYXIgMjU1IC9XaWR0aHMgWyA1MDAgMTAwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDI1OSA1MDAgNTAwIDI1OSA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCAzMTIgMzMyIDQwMSA3MjcgNTQ1IDk3NiA2NzMgMjEwIDM4MiAzODIgNTQ1IDcyNyAzMDIgMzYzIDMwMiAzODIgNTQ1IDU0NSA1NDUgNTQ1IDU0NSA1NDUgNTQ1IDU0NSA1NDUgNTQ1IDM1MyAzNTMgNzI3IDcyNyA3MjcgNDczIDkwOSA1OTkgNTg5IDYwMCA2NzggNTYxIDUyMSA2NjcgNjc1IDM3MyA0MTYgNTg3IDQ5NyA3NzAgNjY3IDcwNyA1NTEgNzA3IDYyMCA1NTcgNTgzIDY1NSA1OTYgOTAxIDU4MCA1NzYgNTU5IDM4MiAzODIgMzgyIDcyNyA1NDUgNTQ1IDUyNCA1NTIgNDYxIDU1MiA1MjYgMzE4IDU1MiA1NTcgMjI4IDI4MSA0OTggMjI4IDgzOSA1NTcgNTQyIDU1MiA1NTIgMzYwIDQ0NiAzMzQgNTU3IDQ5OCA3NDIgNDk1IDQ5OCA0NDQgNDgwIDM4MiA0ODAgNzI3IDUwMCA1NDUgNTAwIDIxMCA1NDUgMzk3IDgxNyA1NDUgNTQ1IDU0NSAxMzkwIDU1NyAzODIgOTc2IDUwMCA1NTkgNTAwIDUwMCAyMTAgMjEwIDQwMSA0MDEgNDU0IDU0NSA5MDkgNTQ1IDg3NSA0NDYgMzgyIDkwOCA1MDAgNDQ0IDU3NiAzMTIgMzMyIDU0NSA1NDUgNTQ1IDU0NSAzODIgNTQ1IDU0NSA5MjggNDkzIDU3MyA3MjcgMzYzIDkyOCA1NDUgNDcwIDcyNyA0OTMgNDkzIDU0NSA1NjcgNTQ1IDM1MyA1NDUgNDkzIDQ5MyA1NzMgMTAwMCAxMDAwIDEwMDAgNDczIDU5OSA1OTkgNTk5IDU5OSA1OTkgNTk5IDkxMyA2MDAgNTYxIDU2MSA1NjEgNTYxIDM3MyAzNzMgMzczIDM3MyA2OTggNjY3IDcwNyA3MDcgNzA3IDcwNyA3MDcgNzI3IDcwNyA2NTUgNjU1IDY1NSA2NTUgNTc2IDU2NSA1NDggNTI0IDUyNCA1MjQgNTI0IDUyNCA1MjQgODc5IDQ2MSA1MjYgNTI2IDUyNiA1MjYgMjI4IDIyOCAyMjggMjI4IDU0NSA1NTcgNTQyIDU0MiA1NDIgNTQyIDU0MiA3MjcgNTQyIDU1NyA1NTcgNTU3IDU1NyA0OTggNTUyIDQ5OCBdIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9CYXNlRm9udCAvQUJDREVFK1RhaG9tYSAvRm9udERlc2NyaXB0b3IgMTEgMCBSID4+DQplbmRvYmoNCjExIDAgb2JqDQo8PCAvVHlwZSAvRm9udERlc2NyaXB0b3IgL0FzY2VudCA3NjUgL0NhcEhlaWdodCAwIC9EZXNjZW50IC0yMDcgL0ZsYWdzIDMyIC9Gb250QkJveCBbIC02MDAgLTQxOSAxODUyIDEwMzQgXSAvRm9udE5hbWUgL0FCQ0RFRStUYWhvbWEgL0l0YWxpY0FuZ2xlIDAgL1N0ZW1WIDAgIC9Gb250RmlsZTIgOSAgMCBSID4+DQplbmRvYmoNCjcgMCBvYmoNCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbIDIgMCBSIF0gL0NvdW50IDEgPj4NCmVuZG9iag0KMTIgMCBvYmoNCjw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyA3IDAgUiA+Pg0KZW5kb2JqDQoxMyAwIG9iag0KPDwgL1RpdGxlIDxmZWZmMDA1MjAwNzAwMDc0MDA1MzAwNGEwMDUwMDA1MjAwNDkwMDU0MDA0YzAwMzIwMDMwMDAzMTAwMzg+DQovQXV0aG9yIDw+DQovU3ViamVjdCA8Pg0KL0NyZWF0b3IgKE1pY3Jvc29mdCBSZXBvcnRpbmcgU2VydmljZXMgMTEuMC4wLjApDQovUHJvZHVjZXIgKE1pY3Jvc29mdCBSZXBvcnRpbmcgU2VydmljZXMgUERGIFJlbmRlcmluZyBFeHRlbnNpb24gMTEuMC4wLjApDQovQ3JlYXRpb25EYXRlIChEOjIwMTkwMzA2MTEyMzQxKzA3JzAwJykNCj4+DQplbmRvYmoNCnhyZWYNCjAgMTQNCjAwMDAwMDAwMDAgNjU1MzUgZg0KMDAwMDAwMDAxMCAwMDAwMCBuDQowMDAwMDAyMDE0IDAwMDAwIG4NCjAwMDAwMDIyMDEgMDAwMDAgbg0KMDAwMDIzMTY0NSAwMDAwMCBuDQowMDAwMjMzMDU1IDAwMDAwIG4NCjAwMDAwMDAwNjUgMDAwMDAgbg0KMDAwMDIzNDQ1MSAwMDAwMCBuDQowMDAwMDk3NzIyIDAwMDAwIG4NCjAwMDAxNTgyODAgMDAwMDAgbg0KMDAwMDIzMjg1MiAwMDAwMCBuDQowMDAwMjM0MjUzIDAwMDAwIG4NCjAwMDAyMzQ1MTMgMDAwMDAgbg0KMDAwMDIzNDU2NiAwMDAwMCBuDQp0cmFpbGVyIDw8IC9TaXplIDE0IC9Sb290IDEyIDAgUiAvSW5mbyAxMyAwIFIgPj4NCnN0YXJ0eHJlZg0KMjM0ODUzDQolJUVPRg==',
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
  pdfMake.defaultFileName = 'print Sjp';
  pdfMake.createPdf(docDefinition).print();

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

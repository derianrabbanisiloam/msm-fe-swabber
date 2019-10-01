import { Component, OnInit, Input, AfterContentChecked, AfterViewChecked, AfterViewInit, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { appointmentPayload } from '../../../payloads/appointment.payload';
import { ModalSearchPatientComponent } from '../../../views/widgets/modal-search-patient/modal-search-patient.component';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientHope } from '../../../models/patients/patient-hope';
import { PatientService } from '../../../services/patient.service';
import { channelId, sourceApps } from '../../../variables/common.variable';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-modal-create-appointment',
  templateUrl: './modal-create-appointment.component.html',
  styleUrls: ['./modal-create-appointment.component.css']
})
export class ModalCreateAppointmentComponent implements OnInit {

  @Input() appointmentInfo: any;
  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public choosedPatient: PatientHope;
  public addAppPayload: appointmentPayload = new appointmentPayload;
  public model: any = {};
  public maskBirth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskPhone = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  public isLock: boolean = false;
  public isSubmitting: boolean = false;
  public userId: string = this.user.id;
  private userName: string = this.user.fullname;
  public source: string = sourceApps;
  public alerts: Alert[] = [];
  public doctorTypeFcfs: string = '1';

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.patientService.searchPatientHopeSource$.subscribe(
      x => {
        this.choosedPatient = x;
        this.model = {
          patientName: x.name,
          birthDate: moment(x.birthDate).format('DD-MM-YYYY'),
          localMrNo: x.mrNoUnit,
          phoneNumber: x.mobileNo1,
          address: x.address,
        };
        this.isLock = true;
      }
    );

    this.getCollectionAlert();
    if (this.appointmentInfo.can_reserved.key 
      && this.appointmentInfo.doctor_type_id !== this.doctorTypeFcfs
      && this.appointmentInfo.is_waiting_list === false) {
      this.isLock = true;
      this.alertService.error('This slot is unavailable at this time, '
        + 'because there is other user using this slot now. '
        + 'Please try again 1 minutes later.', false, 10000);
    }
  }

  ngAfterContentChecked() {
  }

  ngAfterViewChecked() { }

  ngAfterViewInit() { }

  close() {
    this.activeModal.close();
  }

  async createAppointment() {
    this.isSubmitting = true;
    const isValidForm = this.validateCreateAppointment();
    if (isValidForm === false) {
      this.isSubmitting = false;
      return false;
    }
    const data = this.appointmentInfo;
    const { patientName, phoneNumber, address, note } = this.model;
    const dob = this.model.birthDate.split('-');
    const birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];
    const patientHopeId = this.choosedPatient ? this.choosedPatient.patientId : null;
    this.addAppPayload = {
      appointmentDate: data.appointment_date,
      appointmentFromTime: data.appointment_from_time,
      appointmentToTime: data.appointment_to_time,
      appointmentNo: data.appointment_no,
      hospitalId: data.hospital_id,
      doctorId: data.doctor_id,
      scheduleId: data.schedule_id,
      isWaitingList: data.is_waiting_list,
      patientHopeId: patientHopeId,
      name: patientName,
      birthDate: birthDate,
      phoneNumber1: this.filterizePhoneNumber(phoneNumber),
      addressLine1: address,
      note: note,
      channelId: channelId.FRONT_OFFICE,
      userId: this.userId,
      userName: this.userName,
      source: this.source
    };

    await this.appointmentService.addAppointment(this.addAppPayload).toPromise().then(
      data => {
        this.alertService.success('Success to create appointment', false, 3000);
        this.appointmentService.emitCreateApp(true);
        setTimeout(() => { this.close(); }, 2000);
      }, err => {
        this.alertService.error(err.error.message, false, 3000);
      }
    );
    this.isSubmitting = false;
  }

  checkDatePickerIsValid() {
    if (this.model.birthDate && this.model.birthDate.length == 10) {
      let d = this.model.birthDate;
      d = d.split("-");
      let date = d[0];
      let month = d[1];
      let year = d[2];
      let ymd = year + '-' + month + '-' + date;
      let birth: any = new Date(ymd);
      let now = new Date()
      if (birth == 'Invalid Date') {
        $('.form-ca-dob').addClass('form-error');
        return false;
      } else if (now < birth) {
        $('.form-ca-dob').addClass('form-error');
        return false;
      } else {
        return true;
      }
    } else {
      $('.form-ca-dob').addClass('form-error');
      return false;
    }
  }

  checkSearchInput() {
    if (this.model.localMrNo) {
      return true;
    } else if (this.model.patientName && this.model.patientName.length >= 3 && this.model.birthDate) {
      return true;
    } else {
      return false;
    }
  }

  searchPatientHOPE(e?) {
    this.isSubmitting = false;
    if (this.checkSearchInput() === false) {
      return false;
    }
    if (e && Number(e.keyCode) !== 13) {
      return false;
    }

    const hospitalId = this.appointmentInfo.hospital_id;
    let birthDate = null;
    if (!this.model.localMrNo) {
      const dob = this.model.birthDate.split('-');
      birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];
    }
    const params = {
      patientName: this.model.patientName,
      birthDate: birthDate,
      localMrNo: this.model.localMrNo,
    }
    const modalRef = this.modalService.open(ModalSearchPatientComponent, { windowClass: 'modal-searchPatient', size: 'lg' });
    modalRef.componentInstance.searchKeywords = { ...params, hospitalId };
  }

  resetField() {
    this.isSubmitting = false;
    this.model = {};
    this.isLock = false;
  }

  validateCreateAppointment() {
    let isValid = true;
    const { patientName, phoneNumber } = this.model;
    if (!this.checkDatePickerIsValid()) {
      isValid = false;
    } else {
      $('.form-ca-dob').removeClass('form-error');
    }
    if (!patientName) {
      $('.form-ca-patientname').addClass('form-error');
      isValid = false;
    } else {
      $('.form-ca-patientname').removeClass('form-error');
    }
    if (!phoneNumber) {
      $('.form-ca-phoneno').addClass('form-error');
      isValid = false;
    } else {
      $('.form-ca-phoneno').removeClass('form-error');
    }
    return isValid;
  }

  filterizePhoneNumber(phoneNumber: string) {
    phoneNumber = phoneNumber.replace(/_/gi, '');
    return phoneNumber;
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

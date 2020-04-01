import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AlertService } from '../../../services/alert.service';
import { PatientService } from '../../../services/patient.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Doctor } from '../../../models/doctors/doctor';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { ModalRescheduleAppointmentComponent } from '../modal-reschedule-appointment/modal-reschedule-appointment.component';
import { RescheduleAppointment } from '../../../models/appointments/reschedule-appointment';
import { environment } from '../../../../environments/environment';
import {
  ModalVerificationAidoComponent
} from '../../widgets/modal-verification-aido/modal-verification-aido.component';

@Component({
  selector: 'app-widget-aido-worklist',
  templateUrl: './widget-aido-worklist.component.html',
  styleUrls: ['./widget-aido-worklist.component.css']
})
export class WidgetAidoWorklistComponent implements OnInit {
  public detailTemp: any;
  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital: any = this.key.hospital;
  public doctors: Doctor[];
  public aidoAppointments: any [];
  public totalAppointments: number;
  public todayDateISO: any = moment().format('YYYY-MM-DD');
  public pageSelected: number;
  public myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd/mm/yyyy',
    height: '30px'
  };
  public datePickerModel: any = {};
  public hospitalFormModel: any;
  public keywordsModel: KeywordsModel = new KeywordsModel;
  public maskBirth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public alerts: Alert[] = [];
  public isCanPrevPage: boolean = false;
  public isCanNextPage: boolean = false;
  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private modalService: NgbModal,
    private alertService: AlertService,
    modalSetting: NgbModalConfig,
  ) {
    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
   }

  ngOnInit() {
    this.keywordsModel.hospitalId = this.hospital.id;
    this.getDoctors(this.hospital.id);
    this.initializeDateRangePicker();
    this.getCollectionAlert();
    this.getAidoWorklist();
    this.emitVerifyApp();
  }

  emitVerifyApp() {
    this.appointmentService.verifyAppSource$.subscribe(
      async () => {
        await this.getAidoWorklist();
      }
    );
  }

  getDoctors(hospitalId: string) {
    this.doctorService.getListDoctor(hospitalId)
      .subscribe(data => {
        this.doctors = data.data;
      }, err => {
        this.doctors = [];
      }
      );
  }

  initializeDateRangePicker() {
    const m = moment();
    const year = Number(m.format('YYYY'));
    const month = Number(m.format('MM'));
    const date = Number(m.format('DD'));
    this.datePickerModel = {
      beginDate: { year: year, month: month, day: date },
      endDate: { year: year, month: month, day: date },
    };
    this.keywordsModel.fromDate = m.format('YYYY-MM-DD');
    this.keywordsModel.toDate = this.keywordsModel.fromDate;
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
      this.getAidoWorklist();
    }
  }

  getAidoWorklist(doctor?: any) {
    if (doctor) {
      this.keywordsModel.doctorId = doctor.doctor_id;
    }
    const {
      hospitalId = '', fromDate = this.todayDateISO, toDate = this.todayDateISO,
      patientName = '', doctorId = '', offset = 0, limit = 10
    } = this.keywordsModel;
    this.appointmentService.getAidoWorklist(
      hospitalId,
      fromDate,
      toDate,
      patientName,
      doctorId,
      offset,
      limit
    ).subscribe(
      data => {
        this.aidoAppointments = data.data;
        this.aidoAppointments.map(x => {
          x.data_of_birth = moment(x.data_of_birth).format('DD-MM-YYYY');
          x.appointment_date = moment(x.appointment_date).format('DD-MM-YYYY');
          x.appointment_from_time = x.appointment_from_time.substr(0, 5);
          x.appointment_to_time = x.appointment_to_time.substr(0, 5);
        });
        this.isCanNextPage = this.aidoAppointments.length >= 10 ? true : false;
      }
    );
  }

  async verifyAppointment(data) {
    const modalRef = this.modalService.open(ModalVerificationAidoComponent, { windowClass: 'modal_verification', size: 'lg' });
        modalRef.componentInstance.appointmentAidoSelected = data;
  }

  private page: number = 0;
  nextPage() {
    this.page += 1;
    this.keywordsModel.offset = this.page * 10;
    this.isCanPrevPage = this.keywordsModel.offset === 0 ? false : true;
    this.getAidoWorklist();
  }
  prevPage() {
    this.page -= 1;
    this.keywordsModel.offset = this.page * 10;
    this.isCanPrevPage = this.keywordsModel.offset === 0 ? false : true;
    this.getAidoWorklist();
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

class KeywordsModel {
  hospitalId: string;
  fromDate: string;
  toDate: string;
  patientName: string;
  localMrNo: string;
  birthDate: string;
  doctorId: string;
  offset: number;
  limit: number;
}

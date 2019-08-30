import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AlertService } from '../../../services/alert.service';
import { PatientService } from '../../../services/patient.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Doctor } from '../../../models/doctors/doctor';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { ModalRescheduleAppointmentComponent } from '../modal-reschedule-appointment/modal-reschedule-appointment.component';
import { RescheduleAppointment } from '../../../models/appointments/reschedule-appointment';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-widget-reschedule-worklist',
  templateUrl: './widget-reschedule-worklist.component.html',
  styleUrls: ['./widget-reschedule-worklist.component.css']
})
export class WidgetRescheduleWorklistComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital: any = this.key.hospital;
  public doctors: Doctor[];
  public rescheduledAppointments: RescheduleAppointment[];
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
  ) { }

  ngOnInit() {
    //this.getHospitals();
    this.keywordsModel.hospitalId = this.hospital.id;
    this.getDoctors(this.hospital.id);
    this.initializeDateRangePicker();
    this.getCollectionAlert();
    this.emitUpdateContact();
    this.emitRescheduleApp();
    this.getRescheduleWorklist();
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
      this.getRescheduleWorklist();
    }
  }

  getRescheduleWorklist(doctor?: any) {
    if (doctor) {
      this.keywordsModel.doctorId = doctor.doctor_id;
    }
    const {
      hospitalId = '', fromDate = this.todayDateISO, toDate = this.todayDateISO,
      patientName = '', doctorId = '', offset = 0, limit = 10
    } = this.keywordsModel;
    this.appointmentService.getRescheduleWorklist(
      hospitalId,
      fromDate,
      toDate,
      patientName,
      doctorId,
      offset,
      limit
    ).subscribe(
      data => {
        this.rescheduledAppointments = data.data;
        this.rescheduledAppointments.map(x => {
          x.birth_date = moment(x.birth_date).format('DD-MM-YYYY');
          x.appointment_date = moment(x.appointment_date).format('DD-MM-YYYY');
          x.appointment_from_time = x.appointment_from_time.substr(0, 5);
          x.appointment_to_time = x.appointment_to_time.substr(0, 5);
        });
        this.isCanNextPage = this.rescheduledAppointments.length >= 10 ? true : false;
      }
    );
  }

  openRescheduleModal(appointmentSelected: any) {
    const modalRef = this.modalService.open(ModalRescheduleAppointmentComponent,
      { windowClass: 'cc_modal_confirmation', size: 'lg' });
    modalRef.componentInstance.appointmentSelected = appointmentSelected;
  }

  emitUpdateContact() {
    this.patientService.updateContactSource$.subscribe(
      async (result) => {
        if (result) {
          this.alertService.success('Ubah nomor HP berhasil', false, 5000);
          await this.getRescheduleWorklist();
        } else {
          this.alertService.error('Gagal ubah nomor HP', false, 5000);
        }
      }
    );
  }

  emitRescheduleApp() {
    this.appointmentService.rescheduleAppSource$.subscribe(
      result => {
        if (result === true) {
          this.alertService.success('Reschedule appointment berhasil', false, 5000);
          this.getRescheduleWorklist();
        } else {
          this.alertService.error(result, false, 5000);
        }
      }
    );
  }

  private page: number = 0;
  nextPage() {
    this.page += 1;
    this.keywordsModel.offset = this.page * 10;
    this.isCanPrevPage = this.keywordsModel.offset === 0 ? false : true;
    this.getRescheduleWorklist();
  }
  prevPage() {
    this.page -= 1;
    this.keywordsModel.offset = this.page * 10;
    this.isCanPrevPage = this.keywordsModel.offset === 0 ? false : true;
    this.getRescheduleWorklist();
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

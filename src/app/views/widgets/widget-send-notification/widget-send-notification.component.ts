import { Component, OnInit } from '@angular/core';
import { General } from '../../../models/generals/general';
import { Doctor } from '../../../models/doctors/doctor';
import { Receiver } from '../../../models/appointments/receiver';
import { GeneralService } from '../../../services/general.service';
import { DoctorService } from '../../../services/doctor.service';
import { NotificationService } from '../../../services/notification.service';
import { AppointmentService } from '../../../services/appointment.service';
import { dateFormatter, localSpliter } from '../../../utils/helpers.util';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { cacheInfo, sourceApps } from '../../../variables/common.variable';

@Component({
  selector: 'app-widget-send-notification',
  templateUrl: './widget-send-notification.component.html',
  styleUrls: ['./widget-send-notification.component.css']
})
export class WidgetSendNotificationComponent implements OnInit {

  public notificationType: General[];
  public doctorList: Doctor[];
  public doctorSelected: Doctor;
  public patientList: Receiver[];
  public appointmentDate: any;
  public maskAppDate = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public now = new Date();

  public showTable = false;
  public selectedAll: any;
  public notifType: General;
  public notes: any;

  public alerts: Alert[] = [];
  public staticAlertClosed: boolean = false;
  public showWaitMsg: boolean = false;
  public showNotFoundMsg: boolean = false;

  constructor(
    private generalService: GeneralService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.appointmentDate = dateFormatter(this.now, true);

    this.getNotificationType();
    this.getListDoctor();
    this.getCollectionAlert();

    setTimeout(() => this.staticAlertClosed = true, 10000);
  }

  async getNotificationType() {
    this.notificationType = await this.generalService.getNotificationType()
    .toPromise().then(res => {
      if(res.status === 'OK' && res.data.length === 0){
        this.alertService.success('No List notification type');
      }
      return res.data;
    }).catch( err => {
      this.alertService.error(err.error.message);
      return [];
    });
  }

  async getListDoctor() {
    this.doctorList = await this.doctorService.getListDoctor()
    .toPromise().then( res => {
      if(res.status === 'OK' && res.data.length === 0){
        this.alertService.success('No List Doctor in This Hospital');
      }

      return res.data;
    }).catch( err => {
      this.alertService.error(err.error.message);
      return [];
    });
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

  checkDatePickerIsValid(){
    if(this.appointmentDate){
      const d = this.appointmentDate.split('-');
      const date = d[0];
      const month = d[1];
      const year = d[2];
      const ymd = year + '-' + month + '-' + date;

      const appDate: any = new Date(ymd)

      if(appDate == "Invalid Date") {
        this.alertService.error('Date format is wrong');
        return false;
      }else{
        return true;
      }
    }else{
      this.alertService.error('Please input appointment date');
      return false;
    }
  }

  onDateChange(event: any){
    this.displayPatient();
  }

  displayPatient() {
    const status = this.checkDatePickerIsValid();

    if(status){
      this.showWaitMsg = true;
      const doctorId = this.doctorSelected.doctor_id;
      const date = localSpliter(this.appointmentDate, false);
      this.getDoctorPatient(doctorId, date);
    }
  }

  async getDoctorPatient(doctorId: string, date: any) {
    this.patientList = await this.appointmentService.getListReceiver(doctorId, date)
    .toPromise().then( res => {
      if (res.status === 'OK' && res.data.length === 0) {
        this.showNotFoundMsg = true;
      }else{
        for (let i = 0, { length } = res.data; i < length; i++) {
          res.data[i].selected = false;
        }
        this.showTable = true;
      }
      this.showWaitMsg = false;
      
      return res.data;
    }).catch(err => {
      this.showWaitMsg = false;
      this.showNotFoundMsg = true;
      return [];
    });
  }

  selectAll() {
    for (let i = 0, { length } = this.patientList;  i < length; i += 1) {
      this.patientList[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.patientList.every((item: any) => {
      return item.selected === true;
    });
  }

  sendNotif() {
    const idx = this.patientList.findIndex((i) => {
      return i.selected === true;
    });

    if (idx >= 0) {
      const patientSelected = [];

      for (let i = 0, { length } = this.patientList; i < length; i += 1) {
        if (this.patientList[i].selected === true) {
          patientSelected.push({
            contactId: this.patientList[i].contact_id,
          });
        }
      }

      const date = localSpliter(this.appointmentDate, false);

      const userId = cacheInfo.user.id;
      const orgId = cacheInfo.hospital.orgId;
      const source = sourceApps;

      const body = {
        doctorId: this.doctorSelected.doctor_id,
        content: this.notes,
        notifType: this.notifType.value,
        organizationId: orgId,
        bookingDate: date,
        receiver: patientSelected,
        source: source,
        userId: userId,
      };

      this.notifySender(body);
    } else {
      this.alertService.error('Please select patient');
    }
  }

  async notifySender(payload: any) {
    await this.notificationService.sendNotification(payload)
      .toPromise().then( res => {
        if(res.status === 'OK'){
          this.alertService.success(res.message);
        }else{
          this.alertService.error(res.message);
        }
      }).catch(err => {
        this.alertService.error(err.error.message);
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
      this.staticAlertClosed = true;
    }
}

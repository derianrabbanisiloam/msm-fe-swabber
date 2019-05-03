import { Component, OnInit } from '@angular/core';
import { General } from '../../../models/generals/general';
import { Doctor } from '../../../models/doctors/doctor';
import { Receiver } from '../../../models/appointments/receiver';
import { GeneralService } from '../../../services/general.service';
import { DoctorService } from '../../../services/doctor.service';
import { NotificationService } from '../../../services/notification.service';
import { AppointmentService } from '../../../services/appointment.service';
import { FormHandlerMessage } from '../../../models/formHandlerMessage';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { dateFormatter, localSpliter } from '../../../utils/helpers.util';

@Component({
  selector: 'app-widget-send-notification',
  templateUrl: './widget-send-notification.component.html',
  styleUrls: ['./widget-send-notification.component.css']
})
export class WidgetSendNotificationComponent implements OnInit {

  public notificationType: General[];
  public formHandlerMessage: FormHandlerMessage = new FormHandlerMessage;
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

  // alert
  public successMessage: string;
  public _success = new Subject<string>();
  // public errorMessage: string
  // public _error = new Subject<string>()

  constructor(
    private generalService: GeneralService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.appointmentDate = dateFormatter(this.now, true);

    this.getNotificationType();
    this.getListDoctor();

    // this._success.subscribe((message) => this.successMessage = message);
    // debounceTime.call(this._success, 2000).subscribe(() => this.successMessage = null);

    // this._error.subscribe((message) => this.errorMessage = message);
    // debounceTime.call(this._error, 4000).subscribe(() => this.errorMessage = null);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => this.successMessage = null);
  }

  async getNotificationType() {
    this.notificationType = await this.generalService.getNotificationType()
    .toPromise().then(res => {
      return res.data;
    });
  }

  async getListDoctor() {
    this.doctorList = await this.doctorService.getListDoctor()
    .toPromise().then( res => {
      return res.data;
    });
  }

  displayPatient() {
    const doctorId = this.doctorSelected.doctor_id;
    const date = localSpliter(this.appointmentDate, false);

    this.getDoctorPatient(doctorId, date);
  }

  async getDoctorPatient(doctorId: string, date: any) {
    this.patientList = await this.appointmentService.getListReceiver(doctorId, date)
    .toPromise().then( res => {
      if (res.status === 'OK') {
        for (let i = 0, { length } = res.data; i < length; i++) {
          res.data[i].selected = false;
        }

        this.showTable = true;
      }
      return res.data;
    });

    console.log('this.patientList', this.patientList);
  }

  selectAll() {
    for (let i = 0, { length } = this.patientList;  i < length; i += 1) {
      this.patientList[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.patientList.every((item: any) => {
      return item.selected == true;
    });
  }

  sendNotif() {
    const idx = this.patientList.findIndex((i) => {
      return i.selected == true;
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

      const body = {
        doctorId: this.doctorSelected.doctor_id,
        content: this.notes,
        notifType: this.notifType.value,
        organizationId: 2,
        bookingDate: date,
        receiver: patientSelected,
        source: '::ffff:10.83.146.145',
        userId: 'Jamblang'
      };

      this.notifySender(body);
    } else {
      alert('Please select patient');
    }
  }

  async notifySender(payload: any) {
    await this.notificationService.sendNotification(payload)
      .toPromise().then( res => {
        console.log('res', res);
        // alert(res.message);
      }).catch(err => {
        // alert(err.message)
      });
    }
}

import { Component, OnInit, Input } from '@angular/core';
import { ModalUtil } from '../../../utils/modal.util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../services/appointment.service';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { sourceApps } from '../../../variables/common.variable';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-modal-cancel-appointment',
  templateUrl: './modal-cancel-appointment.component.html',
  styleUrls: ['./modal-cancel-appointment.component.css']
})
export class ModalCancelAppointmentComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  @Input() payload: any;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public user = this.key.user;
  public alerts: Alert[] = [];
  private userId: string = this.user.id;
  private userName: string = this.user.fullname;
  private source: string = sourceApps;

  constructor(
    private modalUtil: ModalUtil,
    public activeModal: NgbActiveModal,
    private appointmentService: AppointmentService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.getCollectionAlert();
  }

  close() {
    this.activeModal.close();
    this.modalUtil.changemodalSource1(true);
  }

  deleteAppointment() {
    const body = {
      userId: this.userId,
      userName: this.userName,
      source: this.source
    };

    this.appointmentService.deleteAppointment(this.payload.appointmentId, body, this.payload.temp).subscribe(
      data => {
        this.activeModal.close();
        this.alertService.success('Appointment canceled', false, 5000);
        this.appointmentService.emitCancelApp(true);
      }, err => {
      }
    );
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

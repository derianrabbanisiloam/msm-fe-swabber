import * as moment from 'moment';
import { Component, OnInit, Input } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientService } from '../../../services/patient.service';
import { Appointment } from '../../../models/appointments/appointment';
import { editContactPayload } from '../../../payloads/edit-contact.payload';
import { rescheduleAppointmentPayload } from '../../../payloads/reschedule-appointment.payload';
import { sourceApps, channelId } from '../../../variables/common.variable';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-modal-reschedule-appointment',
  templateUrl: './modal-reschedule-appointment.component.html',
  styleUrls: ['./modal-reschedule-appointment.component.css']
})
export class ModalRescheduleAppointmentComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  @Input() appointmentSelected: any;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;

  public opScheduleSelected: any;
  public opSlotSelected: any;
  public createAppInputData: any = {};
  public rescheduleSelected: any = {};
  public isOpenDoctorSchedule: boolean = false;
  public appointment: any = {};
  public editContactPayload: editContactPayload;
  public rescheduleAppPayload: rescheduleAppointmentPayload;
  public editModel: any = {};
  public flag: string;

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private activeModal: NgbActiveModal
  ) { }

  async ngOnInit() {
    await this.getAppointmentById();
  }

  async getAppointmentById() {
    const app = this.appointmentSelected;

    if (app.appointment_id) {
      this.appointmentService.getAppointmentById(app.appointment_id).subscribe(
        data => {
          this.appointment = data.data[0];
          this.appointment.birth_date = moment(this.appointment.birth_date).format('DD-MM-YYYY');
          this.appointment.created_date = moment(this.appointment.created_date).format('DD-MM-YYYY');
          this.appointment.modified_date = moment(this.appointment.modified_date).format('DD-MM-YYYY');
          this.appointment.appointment_date = moment(this.appointment.appointment_date).format('DD-MM-YYYY');
          this.appointment.from_time = this.appointment.from_time.substring(0, 5);
          this.appointment.to_time = this.appointment.to_time.substring(0, 5);
          this.rescheduleSelected.note = this.appointment.appointment_note;
        }
      );
    } else {
      this.appointment = {
        appointment_temp_id: app.appointment_temporary_id,
        contact_name: app.contact_name,
        medical_record_number: null,
        birth_date: moment(app.date_of_birth).format('DD-MM-YYYY'),
        appointment_date: moment(app.appointment_date).format('DD-MM-YYYY'),
        from_time: app.appointment_from_time.substr(0, 5),
        to_time: app.appointment_to_time.substr(0, 5),
        doctor_name: app.doctor_name,
        is_waiting_list: app.is_waiting_list,
        queue_number: null,
        appointment_note: app.note,
        phone_number: app.phone_number,
        created_name: app.created_name,
        created_date: moment(app.created_date).format('DD-MM-YYYY'),
        modified_name: app.modified_name,
        modified_date: moment(app.modified_date).format('DD-MM-YYYY'),

      }
      this.rescheduleSelected.note = this.appointment.appointment_note;
      this.editModel.phoneNo = this.appointment.phone_number;
    }
  }

  close() {
    this.activeModal.close();
  }

  getScheduleData(data: any) {
    this.opScheduleSelected = data;
    let name = this.appointmentSelected.contact_name;
    name = name ? name : this.appointmentSelected.patient_name;
    this.createAppInputData = {
      scheduleId: data.schedule_id,
      appointmentDate: data.date,
      name: name,
    };
  }

  getSlotData(data: any) {
    const app = this.appointmentSelected;
    const sch = this.opScheduleSelected;
    this.rescheduleAppPayload = {
      scheduleId: sch.schedule_id,
      appointmentDate: sch.date,
      appointmentFromTime: data.appointment_from_time,
      appointmentToTime: data.appointment_to_time,
      appointmentNo: data.appointment_no,
      channelId: channelId.FRONT_OFFICE,
      hospitalId: data.hospital_id,
      isWaitingList: data.is_waiting_list,
      note: this.rescheduleSelected.note,
      userId: this.user.id,
      userName: this.user.fullname,
      source: sourceApps,
    };

    app.appointment_id ? this.rescheduleAppPayload.appointmentId = app.appointment_id :
      this.rescheduleAppPayload.appointmentTemporaryId = app.appointment_temporary_id;
  }

  openDoctorSchedule() {
    this.isOpenDoctorSchedule = this.isOpenDoctorSchedule ? false : true;
    this.flag = this.isOpenDoctorSchedule ? 'block' : 'none';
    this.opScheduleSelected = this.isOpenDoctorSchedule ? this.opScheduleSelected : null;
    const searchKeywords = {
      doctor: {
        doctor_id: this.appointmentSelected.doctor_id,
        name: this.appointmentSelected.doctor_name,
      },
      original: false,
    };
    this.doctorService.changeSearchDoctor(searchKeywords);
  }

  async updateAppointment() {
    const app = this.appointmentSelected;

    if (app.appointment_id) {
      if (this.editModel.phoneNo) {
        await this.updateContact();
      }
      if (this.rescheduleAppPayload) {
        await this.rescheduleAppointment();
      }
      if (this.rescheduleSelected.note !== this.appointmentSelected.appointment_note) {
        await this.updateNotes();
      }
    } else {
      if (this.rescheduleAppPayload) {
        await this.rescheduleAppointment();
      }
      await this.updateDetailTemporaryApp();
    }
  }

  async updateNotes() {
    const appointmentId = this.appointmentSelected.appointment_id;
    const model = {
      notes: this.rescheduleSelected.note,
      userName: this.user.fullname,
      userId: this.user.id,
      source: sourceApps,
    };

    await this.appointmentService.updateAppNotes(appointmentId, model).subscribe(
      (data) => {
        this.appointmentService.emitUpdateNotes(true);
      }, error => {
        this.appointmentService.emitUpdateNotes(false);
      }
    );
  }

  async rescheduleAppointment() {
    this.appointmentService.addRescheduleAppointment(this.rescheduleAppPayload).toPromise().then(
      data => {
        this.appointmentService.emitRescheduleApp(true);
      }, error => {
        this.appointmentService.emitRescheduleApp(false);
      }
    );
  }

  async updateContact() {
    const contactId = this.appointment.contact_id;
    this.editContactPayload = {
      contactId: this.appointment.contact_id,
      data: {
        phoneNumber1: this.editModel.phoneNo,
      },
      userName: this.user.fullname,
      userId: this.user.id,
      source: sourceApps,
    };
    await this.patientService.updateContact(contactId, this.editContactPayload).subscribe(
      (data) => {
        this.patientService.emitUpdateContact(true);
      }, error => {
        this.patientService.emitUpdateContact(false);
      }
    );
  }

  async updateDetailTemporaryApp() {
    //to update detail of temporary appointment

    const tempAppId = this.appointmentSelected.appointment_temporary_id;
    const model = {
      phoneNumber: this.editModel.phoneNo,
      note: this.rescheduleSelected.note,
      userName: this.user.fullname,
      userId: this.user.id,
      source: sourceApps,
    };

    await this.appointmentService.updateDetailTemporaryApp(tempAppId, model).subscribe(
      (data) => {
        this.appointmentService.emitUpdateNotes(true);
      }, error => {
        this.appointmentService.emitUpdateNotes(false);
      }
    );
  }

}

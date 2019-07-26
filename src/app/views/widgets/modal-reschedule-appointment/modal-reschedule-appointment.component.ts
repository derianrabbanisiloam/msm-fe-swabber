import * as moment from 'moment';
import { Component, OnInit, Input} from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientService } from '../../../services/patient.service';
import { Appointment } from '../../../models/appointments/appointment';
import { editContactPayload } from '../../../payloads/edit-contact.payload';
import { rescheduleAppointmentPayload } from '../../../payloads/reschedule-appointment.payload';
import { sourceApps, channelId } from '../../../variables/common.variable';


@Component({
  selector: 'app-modal-reschedule-appointment',
  templateUrl: './modal-reschedule-appointment.component.html',
  styleUrls: ['./modal-reschedule-appointment.component.css']
})
export class ModalRescheduleAppointmentComponent implements OnInit {

  @Input() appointmentSelected: any;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;

  public opScheduleSelected: any;
  public opSlotSelected: any;
  public createAppInputData: any = {};
  public rescheduleSelected: any = {};
  public isOpenDoctorSchedule: boolean = false;
  public appointment: Appointment = new Appointment;
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

  ngOnInit() {
    this.getAppointmentById();
  }

  getAppointmentById() {
    const appointmentId = this.appointmentSelected.appointment_id;
    this.appointmentService.getAppointmentById(appointmentId).subscribe(
      data => {
        this.appointment = data.data[0];
        this.appointment.created_date = moment(this.appointment.created_date).format('DD-MM-YYYY');
        this.appointment.modified_date = moment(this.appointment.modified_date).format('DD-MM-YYYY');
        this.rescheduleSelected.note = this.appointment.appointment_note; 
      }
    );
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
      appointmentId: app.appointment_id,
      scheduleId: sch.schedule_id,
      appointmentDate: sch.date,
      appointmentFromTime: sch.from_time,
      appointmentNo: data.appointment_no,
      channelId: channelId.FRONT_OFFICE,
      hospitalId: data.hospital_id,
      isWaitingList: data.is_waiting_list,
      note: this.rescheduleSelected.note,
      userId: this.user.id,
      userName: this.user.fullname,
      source: sourceApps,
    };
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
    if (this.editModel.phoneNo) {
      await this.updateContact();
    } 
    if (this.rescheduleAppPayload) {
      await this.rescheduleAppointment();    
    }
    if(this.rescheduleSelected.note !== this.appointmentSelected.appointment_note){
      await this.updateNotes();
    }
  }

  async updateNotes(){
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

}

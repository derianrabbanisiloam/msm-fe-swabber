import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  NgbAlertModule, NgbPaginationModule, 
  NgbPopoverModule, NgbProgressbarModule, NgbModalModule
} from '@ng-bootstrap/ng-bootstrap';
import { ModalRescheduleAppointmentComponent } from '../modal-reschedule-appointment/modal-reschedule-appointment.component';
import { WidgetDoctorScheduleModule } from '../widget-doctor-schedule/widget-doctor-schedule.module';
import { WidgetCreateAppointmentModule } from '../widget-create-appointment/widget-create-appointment.module';

@NgModule({
  declarations: [
    ModalRescheduleAppointmentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbProgressbarModule,
    WidgetDoctorScheduleModule,
    WidgetCreateAppointmentModule,
  ],
  exports: [
    ModalRescheduleAppointmentComponent
  ]
})
export class ModalRescheduleAppointmentModule { }

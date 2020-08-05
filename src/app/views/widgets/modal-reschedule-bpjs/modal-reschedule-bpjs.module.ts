import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  NgbAlertModule, NgbPaginationModule, 
  NgbPopoverModule, NgbProgressbarModule, NgbModalModule
} from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ModalRescheduleBpjsComponent } from '../modal-reschedule-bpjs/modal-reschedule-bpjs.component';
import { WidgetDoctorScheduleModule } from '../widget-doctor-schedule/widget-doctor-schedule.module';
import { WidgetCreateAppointmentModule } from '../widget-create-appointment/widget-create-appointment.module';

@NgModule({
  declarations: [
    ModalRescheduleBpjsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbProgressbarModule,
    WidgetDoctorScheduleModule,
    WidgetCreateAppointmentModule,
    ReactiveFormsModule,
    TextMaskModule,
    NguiAutoCompleteModule,
  ],
  exports: [
    ModalRescheduleBpjsComponent
  ]
})
export class ModalRescheduleBpjsModule { }

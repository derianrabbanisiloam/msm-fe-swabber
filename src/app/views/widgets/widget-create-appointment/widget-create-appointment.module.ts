import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, 
  NgbDatepickerModule, NgbModalModule, 
} from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';

import { WidgetCreateAppointmentRoutingModule } from './widget-create-appointment-routing.module';
import { ModalCancelAppointmentModule } from '../modal-cancel-appointment/modal-cancel-appointment.module';
import { ModalCancelAppointmentComponent } from '../modal-cancel-appointment/modal-cancel-appointment.component';
import { ModalCreateAppointmentComponent } from '../modal-create-appointment/modal-create-appointment.component';
import { ModalSearchPatientComponent } from '../modal-search-patient/modal-search-patient.component';
import { ModalScheduleBlockComponent } from '../modal-schedule-block/modal-schedule-block.component';
import { WidgetCreateAppointmentComponent } from './widget-create-appointment.component';

@NgModule({
  declarations: [
    WidgetCreateAppointmentComponent,
    ModalSearchPatientComponent,
    ModalScheduleBlockComponent,
    ModalCreateAppointmentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbModalModule,
    TextMaskModule,
    WidgetCreateAppointmentRoutingModule,
    ModalCancelAppointmentModule,
  ],
  exports: [
    WidgetCreateAppointmentComponent
  ],
  entryComponents: [
    ModalCancelAppointmentComponent,
    ModalCreateAppointmentComponent,
    ModalSearchPatientComponent,
    ModalScheduleBlockComponent
  ]
})
export class WidgetCreateAppointmentModule { }

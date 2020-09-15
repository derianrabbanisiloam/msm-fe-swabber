import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, 
  NgbDatepickerModule, NgbModalModule, NgbTabsetModule
} from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { WidgetCreateAppointmentRoutingModule } from './widget-create-appointment-routing.module';
import { ModalCancelAppointmentModule } from '../modal-cancel-appointment/modal-cancel-appointment.module';
import { ModalCancelAppointmentComponent } from '../modal-cancel-appointment/modal-cancel-appointment.component';
import { WidgetCreateAppointmentComponent } from './widget-create-appointment.component';

@NgModule({
  declarations: [
    WidgetCreateAppointmentComponent,
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
    ReactiveFormsModule,
    WidgetCreateAppointmentRoutingModule,
    ModalCancelAppointmentModule,
    NguiAutoCompleteModule,
    NgbTabsetModule
  ],
  exports: [
    WidgetCreateAppointmentComponent
  ],
  entryComponents: [
    ModalCancelAppointmentComponent,
  ]
})
export class WidgetCreateAppointmentModule { }

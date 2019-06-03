import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalCancelAppointmentComponent } from '../modal-cancel-appointment/modal-cancel-appointment.component';

@NgModule({
  declarations: [
    ModalCancelAppointmentComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalCancelAppointmentComponent
  ]
})
export class ModalCancelAppointmentModule { }

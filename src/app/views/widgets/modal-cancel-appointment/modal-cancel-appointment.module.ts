import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalCancelAppointmentComponent } from '../modal-cancel-appointment/modal-cancel-appointment.component';

@NgModule({
  declarations: [
    ModalCancelAppointmentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ModalCancelAppointmentComponent
  ]
})
export class ModalCancelAppointmentModule { }

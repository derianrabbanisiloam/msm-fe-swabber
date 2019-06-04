import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';

import { ModalCreateAppointmentComponent } from '../modal-create-appointment/modal-create-appointment.component'

@NgModule({
  declarations: [
    ModalCreateAppointmentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbModalModule,
    TextMaskModule,
  ], 
  exports: [
    ModalCreateAppointmentComponent,
  ]
})
export class ModalCreateAppointmentModule { }

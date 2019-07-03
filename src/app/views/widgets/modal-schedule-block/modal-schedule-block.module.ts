import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalScheduleBlockComponent } from './modal-schedule-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ModalScheduleBlockComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule
  ], 
  exports: [
    ModalScheduleBlockComponent,
  ]
})
export class ModalScheduleBlockModule { }

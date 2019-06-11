import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalScheduleBlockComponent } from './modal-schedule-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ModalScheduleBlockComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ], 
  exports: [
    ModalScheduleBlockComponent,
  ]
})
export class ModalScheduleBlockModule { }

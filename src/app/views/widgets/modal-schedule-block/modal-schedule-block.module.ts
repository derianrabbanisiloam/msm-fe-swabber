import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalScheduleBlockComponent } from './modal-schedule-block.component';

@NgModule({
  declarations: [
    ModalScheduleBlockComponent,
  ],
  imports: [
    CommonModule
  ], 
  exports: [
    ModalScheduleBlockComponent,
  ]
})
export class ModalScheduleBlockModule { }

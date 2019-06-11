import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';

import { WidgetDoctorScheduleRoutingModule } from './widget-doctor-schedule-routing.module';
import { WidgetDoctorScheduleComponent } from './widget-doctor-schedule.component';

@NgModule({
  declarations: [ 
    WidgetDoctorScheduleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    WidgetDoctorScheduleRoutingModule,
    NgbAccordionModule,
    MyDatePickerModule,
  ],
  exports: [
    WidgetDoctorScheduleComponent
  ]
})
export class WidgetDoctorScheduleModule { }

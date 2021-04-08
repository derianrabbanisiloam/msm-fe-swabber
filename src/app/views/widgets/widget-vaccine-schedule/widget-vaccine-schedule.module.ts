import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';

import { WidgetVaccineScheduleRoutingModule } from './widget-vaccine-schedule-routing.module';
import { WidgetVaccineScheduleComponent } from './widget-vaccine-schedule.component';

@NgModule({
  declarations: [ 
    WidgetVaccineScheduleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    WidgetVaccineScheduleRoutingModule,
    NgbAccordionModule,
    MyDatePickerModule,
  ],
  exports: [
    WidgetVaccineScheduleComponent
  ]
})
export class WidgetVaccineScheduleModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageBaseAppointmentRoutingModule } from './page-base-appointment-routing.module';
import { PageBaseAppointmentComponent } from './page-base-appointment.component';

import { WidgetDoctorScheduleModule } from '../../widgets/widget-doctor-schedule/widget-doctor-schedule.module';


import { WidgetBaseAppointmentComponent } from '../../widgets/widget-base-appointment/widget-base-appointment.component';
import { MyDatePickerModule } from 'mydatepicker';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, NgbModalModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';


@NgModule({
  declarations: [
    PageBaseAppointmentComponent,
    WidgetBaseAppointmentComponent,
  ],
  imports: [
    CommonModule,
    PageBaseAppointmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    MyDatePickerModule,
    TextMaskModule,
    NgbAlertModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    NgbModalModule,
    NgbTabsetModule,
    AutocompleteLibModule,
    NguiAutoCompleteModule,
    WidgetDoctorScheduleModule,
  ], 
  exports: [
    PageBaseAppointmentComponent,
  ]
})
export class PageBaseAppointmentModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageCreateAppointmentRoutingModule } from './page-create-appointment-routing.module';
import { PageCreateAppointmentComponent } from './page-create-appointment.component';
import { WidgetCreateAppointmentComponent } from '../../widgets/widget-create-appointment/widget-create-appointment.component';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';

import { ModalScheduleBlockModule } from '../../widgets/modal-schedule-block/modal-schedule-block.module';
import { ModalScheduleBlockComponent } from '../../widgets/modal-schedule-block/modal-schedule-block.component';

import { ModalCreateAppointmentModule } from '../../widgets/modal-create-appointment/modal-create-appointment.module';
import { ModalCreateAppointmentComponent } from '../../widgets/modal-create-appointment/modal-create-appointment.component';

import { ModalSearchPatientModule } from '../../widgets/modal-search-patient/modal-search-patient.module';
import { ModalSearchPatientComponent } from '../../widgets/modal-search-patient/modal-search-patient.component'

@NgModule({
  declarations: [
    PageCreateAppointmentComponent,
    WidgetCreateAppointmentComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    PageCreateAppointmentRoutingModule,
    NgbAlertModule,
    NgbModalModule,
    TextMaskModule,
    ModalScheduleBlockModule,
    ModalCreateAppointmentModule,
    ModalSearchPatientModule,
  ],
  entryComponents: [
    ModalScheduleBlockComponent,
    ModalCreateAppointmentComponent,
    ModalSearchPatientComponent
  ],
  exports: [
    PageCreateAppointmentComponent,
  ]
})
export class PageCreateAppointmentModule { }

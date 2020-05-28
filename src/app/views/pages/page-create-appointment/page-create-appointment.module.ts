import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageCreateAppointmentRoutingModule } from './page-create-appointment-routing.module';
import { PageCreateAppointmentComponent } from './page-create-appointment.component';
import { WidgetCreateAppointmentModule } from '../../widgets/widget-create-appointment/widget-create-appointment.module';
import { NgbAlertModule, NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { ModalScheduleBlockModule } from '../../widgets/modal-schedule-block/modal-schedule-block.module';
import { ModalScheduleBlockComponent } from '../../widgets/modal-schedule-block/modal-schedule-block.component';

import { ModalCreateAppointmentModule } from '../../widgets/modal-create-appointment/modal-create-appointment.module';
import { ModalCreateAppointmentComponent } from '../../widgets/modal-create-appointment/modal-create-appointment.component';

import { ModalCancelAppointmentModule } from '../../widgets/modal-cancel-appointment/modal-cancel-appointment.module';
import { ModalCancelAppointmentComponent } from '../../widgets/modal-cancel-appointment/modal-cancel-appointment.component';

import { ModalRescheduleAppointmentModule } from '../../widgets/modal-reschedule-appointment/modal-reschedule-appointment.module';
import { ModalRescheduleAppointmentComponent } from '../../widgets/modal-reschedule-appointment/modal-reschedule-appointment.component'

import { ModalSearchPatientModule } from '../../widgets/modal-search-patient/modal-search-patient.module';
import { ModalSearchPatientComponent } from '../../widgets/modal-search-patient/modal-search-patient.component';

import { ModalPatientVerificationModule } from '../../widgets/modal-patient-verification/modal-patient-verification.module';
import { ModalPatientVerificationComponent } from '../../widgets/modal-patient-verification/modal-patient-verification.component';

import { ModalVerificationAidoModule } from '../../widgets/modal-verification-aido/modal-verification-aido.module';
import { ModalVerificationAidoComponent } from '../../widgets/modal-verification-aido/modal-verification-aido.component';

@NgModule({
  declarations: [
    PageCreateAppointmentComponent,
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
    ModalCancelAppointmentModule,
    ModalSearchPatientModule,
    ModalPatientVerificationModule,
    WidgetCreateAppointmentModule,
    ModalRescheduleAppointmentModule,
    ModalVerificationAidoModule,
    NgbPopoverModule,
    NguiAutoCompleteModule,
    
  ],
  entryComponents: [
    ModalScheduleBlockComponent,
    ModalCreateAppointmentComponent,
    ModalSearchPatientComponent,
    ModalCancelAppointmentComponent,
    ModalPatientVerificationComponent,
    ModalRescheduleAppointmentComponent,
    ModalVerificationAidoComponent,
  ],
  exports: [
    PageCreateAppointmentComponent,
  ]
})
export class PageCreateAppointmentModule { }

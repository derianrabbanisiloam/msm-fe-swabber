import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageAppointmentListBpjsComponent } from './page-appointment-list-bpjs.component';
import { PageAppointmentListBpjsRoutingModule } from './page-appointment-list-bpjs-routing.module';
import { WidgetAppointmentListBpjsComponent } from '../../widgets/widget-appointment-list-bpjs/widget-appointment-list-bpjs.component';
import { MyDatePickerModule } from 'mydatepicker';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { ModalRescheduleBpjsModule } from '../../widgets/modal-reschedule-bpjs/modal-reschedule-bpjs.module';
import { ModalRescheduleBpjsComponent } from '../../widgets/modal-reschedule-bpjs/modal-reschedule-bpjs.component';

@NgModule({
  declarations: [
    PageAppointmentListBpjsComponent,
    WidgetAppointmentListBpjsComponent
  ],
  imports: [
    CommonModule,
    PageAppointmentListBpjsRoutingModule,
    CommonModule,
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
    AutocompleteLibModule,
    NguiAutoCompleteModule,
    ModalRescheduleBpjsModule,
  ],exports: [
    PageAppointmentListBpjsComponent,
  ],
  entryComponents: [
    ModalRescheduleBpjsComponent
  ]
})
export class PageAppointmentListBpjsModule { }

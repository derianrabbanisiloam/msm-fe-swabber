import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { PageAppointmentBpjsComponent } from './page-appointment-bpjs.component';
import { PageAppointmentBpjsRoutingModule } from './page-appointment-bpjs-routing.module';
import { WidgetAppointmentBpjsComponent } from '../../widgets/widget-appointment-bpjs/widget-appointment-bpjs.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TextMaskModule } from 'angular2-text-mask';
import { ModalAppointmentBpjsComponent } from '../../widgets/modal-appointment-bpjs/modal-appointment-bpjs.component';
import { ModalAppointmentBpjsModule } from '../../widgets/modal-appointment-bpjs/modal-appointment-bpjs.module';

@NgModule({
  declarations: [
    PageAppointmentBpjsComponent,
    WidgetAppointmentBpjsComponent,
  ],
  imports: [
    CommonModule,
    PageAppointmentBpjsRoutingModule,
    SectionFooterModule,
    SectionHeaderModule,
    SectionSidebarModule,
    MyDateRangePickerModule,
    NgbModalModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    TextMaskModule,
    ModalAppointmentBpjsModule,
    NguiAutoCompleteModule
  ], 
  exports: [
    PageAppointmentBpjsComponent,
  ],
  entryComponents: [
    ModalAppointmentBpjsComponent,
  ]
})
export class PageAppointmentBpjsModule { }

import {NgModule} from '@angular/core';
import {WidgetRescheduleWorklistComponent} from './widget-reschedule-worklist.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbModalModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {MyDateRangePickerModule} from 'mydaterangepicker';
import {TextMaskModule} from 'angular2-text-mask';
import {ModalRescheduleAppointmentModule} from '../modal-reschedule-appointment/modal-reschedule-appointment.module';
import {ModalAppointmentBpjsModule} from '../modal-appointment-bpjs/modal-appointment-bpjs.module';
import {ModalRescheduleAppointmentComponent} from '../modal-reschedule-appointment/modal-reschedule-appointment.component';
import {ModalAppointmentBpjsComponent} from '../modal-appointment-bpjs/modal-appointment-bpjs.component';

@NgModule({
  declarations: [
    WidgetRescheduleWorklistComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    AutocompleteLibModule,
    MyDateRangePickerModule,
    TextMaskModule,
    ModalRescheduleAppointmentModule,
    ModalAppointmentBpjsModule,
  ],
  entryComponents: [
    ModalRescheduleAppointmentComponent,
    ModalAppointmentBpjsComponent
  ],
  exports: [
    WidgetRescheduleWorklistComponent,
  ]
})
export class WidgetRescheduleWorlistModule { }

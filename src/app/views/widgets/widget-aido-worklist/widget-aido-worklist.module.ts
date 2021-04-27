import {NgModule} from '@angular/core';
import {WidgetAidoWorklistComponent} from './widget-aido-worklist.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbAlertModule, NgbModalModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {MyDateRangePickerModule} from 'mydaterangepicker';
import {TextMaskModule} from 'angular2-text-mask';
import {ModalVerificationAidoModule} from '../modal-verification-aido/modal-verification-aido.module';
import {ModalRescheduleAppointmentModule} from '../modal-reschedule-appointment/modal-reschedule-appointment.module';

@NgModule({
  declarations: [
    WidgetAidoWorklistComponent
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
    ModalVerificationAidoModule,
    NgbAlertModule,
  ],
  exports: [
    WidgetAidoWorklistComponent
  ],
  entryComponents: [
    WidgetAidoWorklistComponent,
  ]
})
export class WidgetAidoWorklistModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageAppointmentListRoutingModule } from './page-appointment-list-routing.module';
import { PageAppointmentListComponent } from './page-appointment-list.component';
import { WidgetAppointmentListComponent } from '../../widgets/widget-appointment-list/widget-appointment-list.component';
import { MyDatePickerModule } from 'mydatepicker';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, NgbModalModule, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { ModalRescheduleAppointmentModule } from '../../widgets/modal-reschedule-appointment/modal-reschedule-appointment.module';
import { ModalRescheduleAppointmentComponent } from '../../widgets/modal-reschedule-appointment/modal-reschedule-appointment.component';

@NgModule({
  declarations: [
    PageAppointmentListComponent,
    WidgetAppointmentListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageAppointmentListRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    MyDatePickerModule,
    NgbDatepickerModule,
    TextMaskModule,
    NgbAlertModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    NgbModalModule,
    AutocompleteLibModule,
    NguiAutoCompleteModule,
    ModalRescheduleAppointmentModule,
  ],
  exports: [
    PageAppointmentListComponent,
  ],
  entryComponents: [
    ModalRescheduleAppointmentComponent
  ]
})
export class PageAppointmentListModule { }

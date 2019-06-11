import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  NgbPaginationModule, NgbModalModule, NgbPopoverModule, NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { TextMaskModule } from 'angular2-text-mask';

import { PageRescheduleWorklistRoutingModule } from './page-reschedule-worklist-routing.module';
import { PageRescheduleWorklistComponent } from './page-reschedule-worklist.component';
import { WidgetRescheduleWorklistComponent } from '../../widgets/widget-reschedule-worklist/widget-reschedule-worklist.component';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';

import { ModalRescheduleAppointmentModule } from '../../widgets/modal-reschedule-appointment/modal-reschedule-appointment.module';
import { ModalRescheduleAppointmentComponent } from '../../widgets/modal-reschedule-appointment/modal-reschedule-appointment.component';

@NgModule({
  declarations: [
    PageRescheduleWorklistComponent,
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
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    PageRescheduleWorklistRoutingModule,
    ModalRescheduleAppointmentModule
  ],
  entryComponents: [
    ModalRescheduleAppointmentComponent
  ]
})
export class PageRescheduleWorklistModule { }

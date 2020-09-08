import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  NgbPaginationModule, NgbModalModule, NgbPopoverModule, NgbProgressbarModule, NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { TextMaskModule } from 'angular2-text-mask';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageRequestListRoutingModule } from './page-request-list-routing.module';
import { PageRequestListComponent } from './page-request-list.component';
import { WidgetRequestListComponent } from '../../widgets/widget-request-list/widget-request-list.component';
import { ModalVerificationAidoModule } from '../../widgets/modal-verification-aido/modal-verification-aido.module';
import { WidgetDoctorScheduleModule } from '../../widgets/widget-doctor-schedule/widget-doctor-schedule.module';
import { MyDatePickerModule } from 'mydatepicker';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

@NgModule({
  declarations: [
    PageRequestListComponent,
    WidgetRequestListComponent
  ],
  imports: [
    CommonModule,
    PageRequestListRoutingModule,
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
    ModalVerificationAidoModule,
    NgbAlertModule,
    WidgetDoctorScheduleModule,
    MyDatePickerModule,
    NguiAutoCompleteModule
  ],
  entryComponents: [
  ],
  exports: [
    PageRequestListComponent,
  ]
})
export class PageRequestListModule { }

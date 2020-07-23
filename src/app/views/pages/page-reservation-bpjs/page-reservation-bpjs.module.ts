import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageReservationBpjsComponent } from './page-reservation-bpjs.component';
import { PageReservationBpjsRoutingModule } from './page-reservation-bpjs-routing.module';
import { WidgetReservationBpjsComponent } from '../../widgets/widget-reservation-bpjs/widget-reservation-bpjs.component';
import { MyDatePickerModule } from 'mydatepicker';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, NgbModalModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { WidgetDoctorScheduleModule } from '../../widgets/widget-doctor-schedule/widget-doctor-schedule.module';

@NgModule({
  declarations: [
    PageReservationBpjsComponent,
    WidgetReservationBpjsComponent,
  ],
  imports: [
    CommonModule,
    PageReservationBpjsRoutingModule,
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
    PageReservationBpjsComponent,
  ]
})
export class PageReservationBpjsModule { }

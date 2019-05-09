import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageDoctorLeaveRoutingModule } from './page-doctor-leave-routing.module';
import { PageDoctorLeaveComponent } from './page-doctor-leave.component';
import { WidgetDoctorLeaveComponent } from '../../widgets/widget-doctor-leave/widget-doctor-leave.component';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [
    PageDoctorLeaveComponent,
    WidgetDoctorLeaveComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageDoctorLeaveRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    NgbModalModule,
    NgbModule,
    MyDateRangePickerModule,
    AutocompleteLibModule,
  ],
  exports: [
    PageDoctorLeaveComponent,
  ]
})
export class PageDoctorLeaveModule { }

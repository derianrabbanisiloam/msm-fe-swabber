import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageDoctorLeaveRoutingModule } from './page-doctor-leave-routing.module';
import { PageDoctorLeaveComponent } from './page-doctor-leave.component';

import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [PageDoctorLeaveComponent],
  imports: [
    CommonModule,
    PageDoctorLeaveRoutingModule,
    NgbModalModule,
    NgbModule,
    MyDateRangePickerModule,
    AutocompleteLibModule,
  ]
})
export class PageDoctorLeaveModule { }

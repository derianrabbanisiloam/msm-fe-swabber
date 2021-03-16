import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageVaccineWorklistRoutingModule } from './page-vaccine-worklist-routing.module';
import { PageVaccineWorklistComponent } from './page-vaccine-worklist.component';
import { WidgetVaccineWorklistComponent } from '../../widgets/widget-vaccine-worklist/widget-vaccine-worklist.component';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { TextMaskModule } from 'angular2-text-mask';
import {
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbTabsetModule,
  NgbModule,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { MyDateRangePickerModule } from 'mydaterangepicker';

@NgModule({
  declarations: [
    PageVaccineWorklistComponent,
    WidgetVaccineWorklistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageVaccineWorklistRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbTabsetModule,
    NgbModule,
    TextMaskModule,
    AutocompleteLibModule,
    NguiAutoCompleteModule,
    NgbModalModule,
    MyDateRangePickerModule
  ], exports: [
    PageVaccineWorklistComponent
  ]
})
export class PageVaccineWorklistModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbAlertModule, NgbPaginationModule,
  NgbPopoverModule, NgbProgressbarModule, NgbModalModule, NgbTabsetModule
} from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ModalRescheduleCheckupComponent } from './modal-reschedule-checkup.component';
import { WidgetVaccineScheduleModule } from '../widget-Vaccine-schedule/widget-vaccine-schedule.module';
import { WidgetCreateAppVaccineModule } from '../widget-create-app-vaccine/widget-create-app-vaccine.module';

@NgModule({
  declarations: [
    ModalRescheduleCheckupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbProgressbarModule,
    WidgetVaccineScheduleModule,
    WidgetCreateAppVaccineModule,
    ReactiveFormsModule,
    TextMaskModule,
    NguiAutoCompleteModule,
    AutocompleteLibModule,
    NgbTabsetModule,
    NgbModalModule,
    NgbPopoverModule,
    NgbAlertModule,
    NgbPaginationModule
  ],
  exports: [
    ModalRescheduleCheckupComponent
  ]
})
export class ModalRescheduleCheckupModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, 
  NgbDatepickerModule, NgbModalModule, NgbTabsetModule
} from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AutocompleteLibModule } from 'angular-ng-autocomplete'

import { WidgetCreateAppVaccineRoutingModule } from './widget-create-app-vaccine-routing.module';
import { ModalCancelAppointmentModule } from '../modal-cancel-appointment/modal-cancel-appointment.module';
import { ModalCancelAppointmentComponent } from '../modal-cancel-appointment/modal-cancel-appointment.component';
import { WidgetCreateAppVaccineComponent } from './widget-create-app-vaccine.component';

@NgModule({
  declarations: [
    WidgetCreateAppVaccineComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbModalModule,
    TextMaskModule,
    ReactiveFormsModule,
    WidgetCreateAppVaccineRoutingModule,
    ModalCancelAppointmentModule,
    NguiAutoCompleteModule,
    AutocompleteLibModule,
    NgbTabsetModule
  ],
  exports: [
    WidgetCreateAppVaccineComponent
  ],
  entryComponents: [
    ModalCancelAppointmentComponent,
  ]
})

export class WidgetCreateAppVaccineModule { }

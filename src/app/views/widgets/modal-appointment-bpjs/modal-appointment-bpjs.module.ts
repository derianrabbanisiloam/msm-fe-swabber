import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ModalAppointmentBpjsComponent } from './modal-appointment-bpjs.component';
import { WidgetDoctorScheduleModule } from '../../widgets/widget-doctor-schedule/widget-doctor-schedule.module';
import { NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, NgbModalModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import { WidgetCreateAppointmentModule } from '../widget-create-appointment/widget-create-appointment.module';

@NgModule({
  declarations: [
    ModalAppointmentBpjsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NguiAutoCompleteModule,
    WidgetDoctorScheduleModule,
    AutocompleteLibModule,
    NgbAlertModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    NgbModalModule,
    NgbTabsetModule,
    WidgetCreateAppointmentModule
  ],
  exports: [
    ModalAppointmentBpjsComponent
  ]
})
export class ModalAppointmentBpjsModule { }

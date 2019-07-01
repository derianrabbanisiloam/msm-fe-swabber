import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule, NgbPopoverModule, 
  NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ModalPatientRegistrationComponent } from './modal-patient-registration.component';

@NgModule({
  declarations: [ModalPatientRegistrationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbModalModule,
    TextMaskModule,
    NguiAutoCompleteModule,
    NgbTabsetModule,
    NgbProgressbarModule,
    NgbPopoverModule,
  ],
  exports: [
    ModalPatientRegistrationComponent,
  ]
})
export class ModalPatientRegistrationModule { }

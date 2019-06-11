import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';

import { ModalPatientVerificationComponent } from '../modal-patient-verification/modal-patient-verification.component';

@NgModule({
  declarations: [
    ModalPatientVerificationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    TextMaskModule,
  ],
  exports: [
    ModalPatientVerificationComponent,
  ]
})
export class ModalPatientVerificationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';

import { ModalVerificationAidoComponent } from './modal-verification-aido.component';

@NgModule({
  declarations: [
    ModalVerificationAidoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    TextMaskModule,
  ],
  exports: [
    ModalVerificationAidoComponent,
  ],
  entryComponents: [
    ModalVerificationAidoComponent
  ]
})
export class ModalVerificationAidoModule { }

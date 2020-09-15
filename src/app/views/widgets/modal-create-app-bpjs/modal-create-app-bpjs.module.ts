import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';

import { ModalCreateAppBpjsComponent } from '../modal-create-app-bpjs/modal-create-app-bpjs.component';

@NgModule({
  declarations: [
    ModalCreateAppBpjsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbModalModule,
    TextMaskModule,
  ], 
  exports: [
    ModalCreateAppBpjsComponent,
  ]
})
export class ModalCreateAppBpjsModule { }

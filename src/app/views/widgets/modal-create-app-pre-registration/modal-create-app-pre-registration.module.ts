import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { ModalCreateAppPreRegistrationComponent } from "./modal-create-app-pre-registration.component";

@NgModule({
  declarations: [
    ModalCreateAppPreRegistrationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    TextMaskModule,
  ],
  exports: [
    ModalCreateAppPreRegistrationComponent,
  ]
})
export class ModalCreateAppPreRegistrationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalSearchPatientComponent } from './modal-search-patient.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ModalSearchPatientComponent,
  ],
  imports: [
    CommonModule,
    NgbProgressbarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ModalSearchPatientComponent,
  ]
})
export class ModalSearchPatientModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalSearchPayerComponent } from './modal-search-payer.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ModalSearchPayerComponent
  ],
  imports: [
    CommonModule,
    NgbProgressbarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ModalSearchPayerComponent
  ]
})
export class ModalSearchPayerModule { }

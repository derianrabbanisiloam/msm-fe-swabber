import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SectionHeaderComponent } from './section-header.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SectionHeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
  ],
  exports: [SectionHeaderComponent]
})
export class SectionHeaderModule { }

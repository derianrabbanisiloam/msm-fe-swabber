import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SectionHeaderComponent } from './section-header.component';

@NgModule({
  declarations: [SectionHeaderComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [SectionHeaderComponent]
})
export class SectionHeaderModule { }

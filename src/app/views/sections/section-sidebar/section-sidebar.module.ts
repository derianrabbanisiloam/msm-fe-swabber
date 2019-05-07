import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { SectionSidebarComponent } from './section-sidebar.component';

@NgModule({
  declarations: [SectionSidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbPopoverModule
  ],
  exports: [SectionSidebarComponent]
})
export class SectionSidebarModule { }

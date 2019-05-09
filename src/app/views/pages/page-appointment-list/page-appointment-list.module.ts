import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageAppointmentListRoutingModule } from './page-appointment-list-routing.module';
import { PageAppointmentListComponent } from './page-appointment-list.component';

@NgModule({
  declarations: [PageAppointmentListComponent],
  imports: [
    CommonModule,
    PageAppointmentListRoutingModule
  ]
})
export class PageAppointmentListModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageCreateAppointmentRoutingModule } from './page-create-appointment-routing.module';
import { PageCreateAppointmentComponent } from './page-create-appointment.component';
import { WidgetCreateAppointmentComponent } from '../../widgets/widget-create-appointment/widget-create-appointment.component';

@NgModule({
  declarations: [
    PageCreateAppointmentComponent,
    WidgetCreateAppointmentComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    PageCreateAppointmentRoutingModule,
  ],
  exports: [
    PageCreateAppointmentComponent,
  ]
})
export class PageCreateAppointmentModule { }

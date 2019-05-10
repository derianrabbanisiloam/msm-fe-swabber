import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageAppointmentListRoutingModule } from './page-appointment-list-routing.module';
import { PageAppointmentListComponent } from './page-appointment-list.component';
import { WidgetAppointmentListComponent } from '../../widgets/widget-appointment-list/widget-appointment-list.component';

@NgModule({
  declarations: [
    PageAppointmentListComponent,
    WidgetAppointmentListComponent,
  ],
  imports: [
    CommonModule,
    PageAppointmentListRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
  ],
  exports: [
    PageAppointmentListComponent,
  ]
})
export class PageAppointmentListModule { }

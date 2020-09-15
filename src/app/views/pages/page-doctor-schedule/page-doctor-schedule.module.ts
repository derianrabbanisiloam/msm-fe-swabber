import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageDoctorScheduleRoutingModule } from './page-doctor-schedule-routing.module';
import { PageDoctorScheduleComponent } from './page-doctor-schedule.component';
import { NgbAlertModule, NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetDoctorScheduleModule } from '../../widgets/widget-doctor-schedule/widget-doctor-schedule.module';

@NgModule({
  declarations: [
    PageDoctorScheduleComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    NgbAlertModule,
    NgbModalModule,
    NgbPopoverModule,
    PageDoctorScheduleRoutingModule,
    WidgetDoctorScheduleModule
  ],
  exports: [
    PageDoctorScheduleComponent,
  ]
})
export class PageDoctorScheduleModule { }

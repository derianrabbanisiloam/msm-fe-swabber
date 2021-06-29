import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageRescheduleWorklistRoutingModule } from './page-reschedule-worklist-routing.module';
import { PageRescheduleWorklistComponent } from './page-reschedule-worklist.component';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';

import {WidgetRescheduleWorlistModule} from '../../widgets/widget-reschedule-worklist/widget-reschedule-worlist.module';

@NgModule({
  declarations: [
    PageRescheduleWorklistComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    PageRescheduleWorklistRoutingModule,
    WidgetRescheduleWorlistModule,
  ],
})
export class PageRescheduleWorklistModule { }

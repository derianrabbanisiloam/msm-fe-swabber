import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PageSendNotificationRoutingModule } from './page-send-notification-routing.module';
import { PageSendNotificationComponent } from './page-send-notification.component';
import { WidgetSendNotificationComponent } from '../../widgets/widget-send-notification/widget-send-notification.component';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { NgbAlertModule, NgbTooltipModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

@NgModule({
  declarations: [
    PageSendNotificationComponent,
    WidgetSendNotificationComponent,
  ],
  imports: [
    CommonModule,
    PageSendNotificationRoutingModule,
    FormsModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    NgbAlertModule,
    NgbTooltipModule,
    NgbModalModule,
    TextMaskModule,
    NguiAutoCompleteModule
  ],
  exports: [
    PageSendNotificationComponent
  ]
})
export class PageSendNotificationModule { }

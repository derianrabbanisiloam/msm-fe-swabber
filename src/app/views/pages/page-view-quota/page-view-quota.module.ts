import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageViewQuotaRoutingModule } from './page-view-quota-routing.module';
import { PageViewQuotaComponent } from './page-view-quota.component';
import { WidgetViewQuotaComponent } from '../../widgets/widget-view-quota/widget-view-quota.component';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    PageViewQuotaComponent,
    WidgetViewQuotaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageViewQuotaRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    NgbProgressbarModule,
    NgbTooltipModule,
  ],
  exports: [
    PageViewQuotaComponent
  ]
})
export class PageViewQuotaModule { }

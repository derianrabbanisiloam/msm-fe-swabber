import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHomeRoutingModule } from './page-home-routing.module';
import { PageHomeComponent } from './page-home.component';

import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';

@NgModule({
  declarations: [PageHomeComponent],
  imports: [
    CommonModule,
    PageHomeRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
  ],
  exports: [
    PageHomeComponent
  ]
})
export class PageHomeModule { }

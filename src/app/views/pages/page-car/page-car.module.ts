import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PageCarRoutingModule } from './page-car-routing.module';
import { PageCarComponent } from './page-car.component';
import { WidgetCarsComponent } from '../../widgets/widget-cars/widget-cars.component';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    PageCarComponent,
    WidgetCarsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageCarRoutingModule,
    SectionHeaderModule,
    SectionFooterModule,
    SectionSidebarModule,
  ],
  exports: [
    PageCarComponent
  ]
})
export class PageCarModule { }

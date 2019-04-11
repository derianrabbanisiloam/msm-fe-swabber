import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PageCarRoutingModule } from './page-car-routing.module';
import { PageCarComponent } from './page-car.component';
import { WidgetCarsComponent } from '../../widgets/widget-cars/widget-cars.component';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module'; 
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';

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
  ],
  exports: [
    PageCarComponent
  ]
})
export class PageCarModule { }

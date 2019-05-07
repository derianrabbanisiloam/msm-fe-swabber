import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PageFoodRoutingModule } from './page-food-routing.module';
import { PageFoodComponent } from './page-food.component';
import { WidgetFoodsComponent } from '../../widgets/widget-foods/widget-foods.component';
import { WidgetFoodsDetailComponent } from '../../widgets/widget-foods-detail/widget-foods-detail.component';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';

@NgModule({
  declarations: [
    PageFoodComponent,
    WidgetFoodsComponent,
    WidgetFoodsDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageFoodRoutingModule,
    SectionHeaderModule,
    SectionFooterModule
  ],
  exports: [
    PageFoodComponent
  ]
})
export class PageFoodModule { }

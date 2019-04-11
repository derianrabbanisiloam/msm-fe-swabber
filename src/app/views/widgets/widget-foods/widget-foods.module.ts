import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetFoodsRoutingModule } from './widget-foods-routing.module';
import { WidgetFoodsComponent } from './widget-foods.component';

@NgModule({
  declarations: [
    WidgetFoodsComponent
  ],
  imports: [
    CommonModule,
    WidgetFoodsRoutingModule
  ],
  exports: [
    WidgetFoodsComponent
  ]
})
export class WidgetFoodsModule { }

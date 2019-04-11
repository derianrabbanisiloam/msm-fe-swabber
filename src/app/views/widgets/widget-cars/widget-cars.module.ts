import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WidgetCarsComponent } from './widget-cars.component';

@NgModule({
  declarations: [WidgetCarsComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    WidgetCarsComponent
  ]
})
export class WidgetCarsModule { }

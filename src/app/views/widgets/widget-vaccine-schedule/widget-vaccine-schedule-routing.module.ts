import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetVaccineScheduleComponent } from './widget-vaccine-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: WidgetVaccineScheduleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetVaccineScheduleRoutingModule { }

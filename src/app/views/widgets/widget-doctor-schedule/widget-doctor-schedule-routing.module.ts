import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetDoctorScheduleComponent } from './widget-doctor-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: WidgetDoctorScheduleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetDoctorScheduleRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetCreateAppointmentComponent } from './widget-create-appointment.component';

const routes: Routes = [
  {
    path: '',
    component: WidgetCreateAppointmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetCreateAppointmentRoutingModule { }

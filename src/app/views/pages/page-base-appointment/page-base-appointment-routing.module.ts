import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageBaseAppointmentComponent } from './page-base-appointment.component';

const routes: Routes = [
  {
    path: '',
    component: PageBaseAppointmentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageBaseAppointmentRoutingModule { }

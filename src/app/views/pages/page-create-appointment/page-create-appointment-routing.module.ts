import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageCreateAppointmentComponent } from './page-create-appointment.component';

const routes: Routes = [
  {
    path: '',
    component: PageCreateAppointmentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageCreateAppointmentRoutingModule { }

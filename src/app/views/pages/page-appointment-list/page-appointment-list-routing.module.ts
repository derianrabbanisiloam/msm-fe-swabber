import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageAppointmentListComponent } from './page-appointment-list.component';

const routes: Routes = [
  {
    path: '',
    component: PageAppointmentListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageAppointmentListRoutingModule { }

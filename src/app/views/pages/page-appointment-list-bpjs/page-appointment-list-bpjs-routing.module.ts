import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageAppointmentListBpjsComponent } from './page-appointment-list-bpjs.component';

const routes: Routes = [
  {
    path: '',
    component: PageAppointmentListBpjsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageAppointmentListBpjsRoutingModule { }

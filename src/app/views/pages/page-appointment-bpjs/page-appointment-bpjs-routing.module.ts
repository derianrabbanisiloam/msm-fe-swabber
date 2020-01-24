import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageAppointmentBpjsComponent } from './page-appointment-bpjs.component'; 

const routes: Routes = [
  {
    path: '',
    component: PageAppointmentBpjsComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageAppointmentBpjsRoutingModule { }

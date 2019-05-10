import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageDoctorLeaveComponent } from './page-doctor-leave.component';

const routes: Routes = [
  {
    path: '',
    component: PageDoctorLeaveComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageDoctorLeaveRoutingModule { }

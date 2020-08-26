import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageDoctorScheduleComponent } from './page-doctor-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: PageDoctorScheduleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageDoctorScheduleRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageRescheduleWorklistComponent } from './page-reschedule-worklist.component';

const routes: Routes = [
  {
    path: '',
    component: PageRescheduleWorklistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRescheduleWorklistRoutingModule { }

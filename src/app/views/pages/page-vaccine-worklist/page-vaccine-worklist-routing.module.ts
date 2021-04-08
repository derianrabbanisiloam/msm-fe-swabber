import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageVaccineWorklistComponent } from './page-vaccine-worklist.component';

const routes: Routes = [
  {
    path: '',
    component: PageVaccineWorklistComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageVaccineWorklistRoutingModule { }

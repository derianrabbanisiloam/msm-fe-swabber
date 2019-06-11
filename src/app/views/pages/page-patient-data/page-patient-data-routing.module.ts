import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagePatientDataComponent } from './page-patient-data.component';

const routes: Routes = [
  {
    path: '',
    component: PagePatientDataComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagePatientDataRoutingModule { }

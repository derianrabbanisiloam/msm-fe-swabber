import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageVaccineConsentListComponent } from './page-vaccine-consent-list.component';

const routes: Routes = [
  {
    path: '',
    component: PageVaccineConsentListComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageVaccineConsentListRoutingModule { }

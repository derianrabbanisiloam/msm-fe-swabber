import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageReservationBpjsComponent } from './page-reservation-bpjs.component';

const routes: Routes = [
  {
    path: '',
    component: PageReservationBpjsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageReservationBpjsRoutingModule { }

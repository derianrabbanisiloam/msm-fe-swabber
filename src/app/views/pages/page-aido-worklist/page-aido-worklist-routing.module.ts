import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageAidoWorklistComponent } from './page-aido-worklist.component';

const routes: Routes = [
  {
    path: '',
    component: PageAidoWorklistComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageAidoWorklistRoutingModule { }

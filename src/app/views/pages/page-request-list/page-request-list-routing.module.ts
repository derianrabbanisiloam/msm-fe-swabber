import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageRequestListComponent } from './page-request-list.component'; 

const routes: Routes = [
  {
    path: '',
    component: PageRequestListComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRequestListRoutingModule { }

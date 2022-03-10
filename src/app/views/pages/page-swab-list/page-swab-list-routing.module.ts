import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageSwabListComponent } from './page-swab-list.component';

const routes: Routes = [
  {
    path: '',
    component: PageSwabListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageSwabListRoutingModule { }

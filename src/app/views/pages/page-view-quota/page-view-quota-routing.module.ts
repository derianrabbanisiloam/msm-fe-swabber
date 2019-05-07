import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageViewQuotaComponent } from './page-view-quota.component';

const routes: Routes = [
  {
    path: '',
    component: PageViewQuotaComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageViewQuotaRoutingModule { }

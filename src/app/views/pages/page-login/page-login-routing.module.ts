import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageLoginComponent } from './page-login.component';

const routes: Routes = [
  {
    path: '',
    component: PageLoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageLoginRoutingModule { }

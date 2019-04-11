import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageCarComponent } from './page-car.component';

const routes: Routes = [
  {
    path: '',
    component: PageCarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageCarRoutingModule { }

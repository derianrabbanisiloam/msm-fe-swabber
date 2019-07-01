import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageMobileValidationComponent } from './page-mobile-validation.component';

const routes: Routes = [
  {
    path: '',
    component: PageMobileValidationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageMobileValidationRoutingModule { }

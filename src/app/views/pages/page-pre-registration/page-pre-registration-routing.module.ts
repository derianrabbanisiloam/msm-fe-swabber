import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagePreRegistrationComponent } from './page-pre-registration.component';

const routes: Routes = [
  {
    path: '',
    component: PagePreRegistrationComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagePreRegistrationRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetCreateAppVaccineComponent } from './widget-create-app-vaccine.component';

const routes: Routes = [
  {
    path: '',
    component: WidgetCreateAppVaccineComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetCreateAppVaccineRoutingModule { }

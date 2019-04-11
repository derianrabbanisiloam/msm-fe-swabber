import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageFoodComponent } from './page-food.component';

const routes: Routes = [
  {
    path: '',
    component: PageFoodComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageFoodRoutingModule { }

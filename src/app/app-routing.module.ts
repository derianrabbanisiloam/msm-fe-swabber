import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'cars',
    loadChildren: './views/pages/page-car/page-car.module#PageCarModule'
  },
  {
    path: 'foods',
    loadChildren: './views/pages/page-food/page-food.module#PageFoodModule'
  },
  {
    path: '**',
    loadChildren: './views/pages/page-car/page-car.module#PageCarModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

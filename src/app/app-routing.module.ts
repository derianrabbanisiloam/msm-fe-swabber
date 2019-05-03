import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app/guard/auth.guard';

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
    path: 'login',
    loadChildren: './views/pages/page-login/page-login.module#PageLoginModule'
  },
  {
    path: 'view-quota',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-view-quota/page-view-quota.module#PageViewQuotaModule'
  },
  {
    path: 'send-notification',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-send-notification/page-send-notification.module#PageSendNotificationModule'
  },
  {
    path: '**',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-car/page-car.module#PageCarModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

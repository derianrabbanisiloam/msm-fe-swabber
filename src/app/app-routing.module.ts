import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app/guard/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './views/pages/page-login/page-login.module#PageLoginModule',
  },
  {
    path: 'appointment-list',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-appointment-list/page-appointment-list.module#PageAppointmentListModule',
  },
  {
    path: 'view-quota',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-view-quota/page-view-quota.module#PageViewQuotaModule',
  },
  {
    path: 'send-notification',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-send-notification/page-send-notification.module#PageSendNotificationModule',
  },
  {
    path: 'doctor-notes',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-doctor-note/page-doctor-note.module#PageDoctorNoteModule',
  },
  {
    path: 'doctor-leave',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-doctor-leave/page-doctor-leave.module#PageDoctorLeaveModule',
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-home/page-home.module#PageHomeModule'
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-home/page-home.module#PageHomeModule'
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

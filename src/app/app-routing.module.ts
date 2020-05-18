import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app/guard/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './views/pages/page-login/page-login.module#PageLoginModule',
  },
  {
    path: 'patient-data',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-patient-data/page-patient-data.module#PagePatientDataModule',
  },
  {
    path: 'create-appointment',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-create-appointment/page-create-appointment.module#PageCreateAppointmentModule',
  },
  {
    path: 'create-appointment-271095',
    canActivate: [AuthGuard],
    loadChildren: './views/widgets/widget-create-appointment/widget-create-appointment.module#WidgetCreateAppointmentModule',
  },
  {
    path: 'base-appointment',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-base-appointment/page-base-appointment.module#PageBaseAppointmentModule',
  },
  {
    path: 'mobile-validation',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-mobile-validation/page-mobile-validation.module#PageMobileValidationModule',
  },
  {
    path: 'appointment-list',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-appointment-list/page-appointment-list.module#PageAppointmentListModule',
  },
  {
    path: 'bpjs',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-appointment-bpjs/page-appointment-bpjs.module#PageAppointmentBpjsModule',
  },
  {
    path: 'view-quota',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-view-quota/page-view-quota.module#PageViewQuotaModule',
  },
  {
    path: 'reschedule-worklist',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-reschedule-worklist/page-reschedule-worklist.module#PageRescheduleWorklistModule',
  },
  {
    path: 'teleconsultation-worklist',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-aido-worklist/page-aido-worklist.module#PageAidoWorklistModule',
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

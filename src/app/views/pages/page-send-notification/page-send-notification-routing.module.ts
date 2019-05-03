import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageSendNotificationComponent } from './page-send-notification.component';

const routes: Routes = [
  {
    path: '',
    component: PageSendNotificationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageSendNotificationRoutingModule { }

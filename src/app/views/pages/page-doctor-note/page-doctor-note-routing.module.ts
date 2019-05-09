import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageDoctorNoteComponent } from './page-doctor-note.component';

const routes: Routes = [
  {
    path: '',
    component: PageDoctorNoteComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageDoctorNoteRoutingModule { }

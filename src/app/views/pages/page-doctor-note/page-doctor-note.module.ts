import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageDoctorNoteRoutingModule } from './page-doctor-note-routing.module';
import { PageDoctorNoteComponent } from './page-doctor-note.component';
import { WidgetDoctorNoteComponent } from '../../widgets/widget-doctor-note/widget-doctor-note.component';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [
    PageDoctorNoteComponent,
    WidgetDoctorNoteComponent,
  ],
  imports: [
    CommonModule,
    PageDoctorNoteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    MyDateRangePickerModule,
    AutocompleteLibModule,
  ],
  exports: [
    PageDoctorNoteComponent,
  ]
})
export class PageDoctorNoteModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';

import { PagePatientDataRoutingModule } from './page-patient-data-routing.module';
import { PagePatientDataComponent } from './page-patient-data.component';

import { WidgetPatientDataComponent } from '../../widgets/widget-patient-data/widget-patient-data.component';

import { TextMaskModule } from 'angular2-text-mask';
import { NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, 
  NgbModalModule, NgbTabsetModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ModalSearchPayerModule } from '../../widgets/modal-search-payer/modal-search-payer.module';
import { ModalSearchPayerComponent } from '../../widgets/modal-search-payer/modal-search-payer.component';

@NgModule({
  declarations: [
    PagePatientDataComponent,
    WidgetPatientDataComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    PagePatientDataRoutingModule,
    NgbAlertModule,
    TextMaskModule,
    AutocompleteLibModule,
    NgbDatepickerModule,
    NguiAutoCompleteModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    NgbModalModule,
    NgbTabsetModule,
    ModalSearchPayerModule
  ],
  exports: [
    PagePatientDataComponent,
  ],
  entryComponents: [
    ModalSearchPayerComponent
  ]
})
export class PagePatientDataModule { }

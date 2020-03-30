import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  NgbPaginationModule, NgbModalModule, NgbPopoverModule, NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { TextMaskModule } from 'angular2-text-mask';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageAidoWorklistRoutingModule } from './page-aido-worklist-routing.module';
import { PageAidoWorklistComponent } from './page-aido-worklist.component';
import { WidgetAidoWorklistComponent } from '../../widgets/widget-aido-worklist/widget-aido-worklist.component';
import { ModalPatientVerificationModule } from '../../widgets/modal-patient-verification/modal-patient-verification.module';
import { ModalPatientVerificationComponent } from '../../widgets/modal-patient-verification/modal-patient-verification.component';

@NgModule({
  declarations: [
    PageAidoWorklistComponent,
    WidgetAidoWorklistComponent
  ],
  imports: [
    CommonModule,
    PageAidoWorklistRoutingModule,
    FormsModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    AutocompleteLibModule,
    MyDateRangePickerModule,
    TextMaskModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    ModalPatientVerificationModule
  ],
  entryComponents: [
    ModalPatientVerificationComponent,
  ]
})
export class PageAidoWorklistModule { }

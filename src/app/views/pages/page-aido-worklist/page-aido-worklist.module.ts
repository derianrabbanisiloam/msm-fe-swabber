import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  NgbPaginationModule, NgbModalModule, NgbPopoverModule, NgbProgressbarModule, NgbAlertModule
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
import { ModalVerificationAidoComponent } from '../../widgets/modal-verification-aido/modal-verification-aido.component';
import { ModalVerificationAidoModule } from '../../widgets/modal-verification-aido/modal-verification-aido.module';

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
    ModalVerificationAidoModule,
    NgbAlertModule
  ],
  entryComponents: [
    ModalVerificationAidoComponent,
  ]
})
export class PageAidoWorklistModule { }

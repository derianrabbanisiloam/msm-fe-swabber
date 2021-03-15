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
import { MyDatePickerModule } from 'mydatepicker';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { WidgetPreRegistrationComponent } from '../../widgets/widget-pre-registration/widget-pre-registration.component';
import { PagePreRegistrationComponent } from './page-pre-registration.component';
import { PagePreRegistrationRoutingModule } from './page-pre-registration-routing.module';
import { ModalCreateAppPreRegistrationComponent } from '../../widgets/modal-create-app-pre-registration/modal-create-app-pre-registration.component';
import { ModalCreateAppPreRegistrationModule } from '../../widgets/modal-create-app-pre-registration/modal-create-app-pre-registration.module';

@NgModule({
  declarations: [
    PagePreRegistrationComponent,
    WidgetPreRegistrationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PagePreRegistrationRoutingModule,
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
    NgbAlertModule,
    MyDatePickerModule,
    NguiAutoCompleteModule,
    ModalCreateAppPreRegistrationModule
  ],
  entryComponents: [
    ModalCreateAppPreRegistrationComponent
  ],
  exports: [
    PagePreRegistrationComponent,
  ]
})
export class PagePreRegistrationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';

import { PageMobileValidationRoutingModule } from './page-mobile-validation-routing.module';
import { PageMobileValidationComponent } from './page-mobile-validation.component';

import { ModalPatientRegistrationModule } from '../../widgets/modal-patient-registration/modal-patient-registration.module';
import { ModalPatientRegistrationComponent } from '../../widgets/modal-patient-registration/modal-patient-registration.component';

import { TextMaskModule } from 'angular2-text-mask';
import { WidgetMobileValidationComponent } from '../../widgets/widget-mobile-validation/widget-mobile-validation.component';
import { NgbProgressbarModule, NgbAlertModule, NgbModalModule , NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
  declarations: [
    PageMobileValidationComponent,
    WidgetMobileValidationComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    PageMobileValidationRoutingModule,
    ModalPatientRegistrationModule,
    NgbProgressbarModule,
    NgbModalModule,
    NgbTooltipModule,
    TextMaskModule,
    NguiAutoCompleteModule,
    NgbAlertModule,
    ArchwizardModule
  ],
  exports: [
    PageMobileValidationComponent,
  ],
  entryComponents: [
    ModalPatientRegistrationComponent,
  ]
})
export class PageMobileValidationModule { }

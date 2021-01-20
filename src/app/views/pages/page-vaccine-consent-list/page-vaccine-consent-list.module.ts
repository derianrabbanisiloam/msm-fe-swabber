import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageVaccineConsentListRoutingModule } from './page-vaccine-consent-list-routing.module';
import { PageVaccineConsentListComponent } from './page-vaccine-consent-list.component';
import { WidgetVaccineConsentListComponent } from '../../widgets/widget-vaccine-consent-list/widget-vaccine-consent-list.component';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { NgbProgressbarModule, NgbTooltipModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    PageVaccineConsentListComponent,
    WidgetVaccineConsentListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageVaccineConsentListRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbTabsetModule,
  ],
  exports: [
    PageVaccineConsentListComponent
  ]
})
export class PageVaccineConsentListModule { }

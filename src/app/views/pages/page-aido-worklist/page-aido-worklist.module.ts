import { NgModule } from '@angular/core';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageAidoWorklistRoutingModule } from './page-aido-worklist-routing.module';
import { PageAidoWorklistComponent } from './page-aido-worklist.component';
import { ModalVerificationAidoComponent } from '../../widgets/modal-verification-aido/modal-verification-aido.component';
import {WidgetAidoWorklistModule} from '../../widgets/widget-aido-worklist/widget-aido-worklist.module';

@NgModule({
  declarations: [
    PageAidoWorklistComponent,
  ],
  imports: [
    PageAidoWorklistRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    WidgetAidoWorklistModule,
  ],
  entryComponents: [
    ModalVerificationAidoComponent,
  ]
})
export class PageAidoWorklistModule { }

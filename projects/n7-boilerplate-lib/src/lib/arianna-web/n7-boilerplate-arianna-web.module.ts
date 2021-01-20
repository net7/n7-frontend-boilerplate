// MODULES
import { NgModule, ApplicationInitStatus } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RouterModule } from '@angular/router';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { N7BoilerplateCommonModule } from '../common/n7-boilerplate-common.module';
// LAYOUTS
import { AwEntitaLayoutComponent } from './layouts/entita-layout/entita-layout';
import { AwGalleryLayoutComponent } from './layouts/gallery-layout/gallery-layout';
import { AwHomeLayoutComponent } from './layouts/home-layout/home-layout';
import { AwMapLayoutComponent } from './layouts/map-layout/map-layout';
import { AwSchedaLayoutComponent } from './layouts/scheda-layout/scheda-layout';
import { AwSearchLayoutComponent } from './layouts/search-layout/search-layout';
import { AwTimelineLayoutComponent } from './layouts/timeline-layout/timeline-layout';
// COMPONENTS
import { AwFacetsWrapperComponent } from './components/aw-facets-wrapper/aw-facets-wrapper';
import { BubbleChartWrapperComponent } from './components/bubble-chart-wrapper/bubble-chart-wrapper';
import { ChartTippyComponent } from './components/chart-tippy/chart-tippy';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer';
import { SchedaDropdownComponent } from './components/scheda-dropdown/scheda-dropdown';
import { SmartBreadcrumbsComponent } from './components/smart-breadcrumbs/smart-breadcrumbs';
// LIBS

import { ConfigurationService } from '../common/services/configuration.service';
import apolloConfig from './config/apollo.config';

const COMPONENTS = [
  AwEntitaLayoutComponent,
  AwGalleryLayoutComponent,
  AwHomeLayoutComponent,
  AwMapLayoutComponent,
  AwSchedaLayoutComponent,
  AwSearchLayoutComponent,
  AwTimelineLayoutComponent,
  BubbleChartWrapperComponent,
  ChartTippyComponent,
  SmartBreadcrumbsComponent,
  AwFacetsWrapperComponent,
  PdfViewerComponent,
  SchedaDropdownComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    RouterModule,
    DvComponentsLibModule,
    N7BoilerplateCommonModule,
    NgxExtendedPdfViewerModule
  ],
  entryComponents: COMPONENTS,
  exports: COMPONENTS,
})
export class N7BoilerplateAriannaWebModule {
  constructor(
    initStatus: ApplicationInitStatus,
    config: ConfigurationService
  ) {
    // add apollo config on app init
    // note: this is just for arianna* sites!
    initStatus.donePromise.then(() => {
      const communication = config.get('communication');
      const { defaultProvider } = communication;
      communication.providers[defaultProvider].config = apolloConfig;
      config.set('communication', communication);
    });
  }
}

// MODULES
import { NgModule, ApplicationInitStatus } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RouterModule } from '@angular/router';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateCommonModule } from '../common/n7-boilerplate-common.module';
// LAYOUTS
import { AwEntitaLayoutComponent } from './layouts/entita-layout/entita-layout';
import { AwHomeLayoutComponent } from './layouts/home-layout/home-layout';
import { AwSchedaLayoutComponent } from './layouts/scheda-layout/scheda-layout';
import { AwSearchLayoutComponent } from './layouts/search-layout/search-layout';
import { AwGalleryLayoutComponent } from './layouts/gallery-layout/gallery-layout';
// COMPONENTS
import { ChartTippyComponent } from './components/chart-tippy/chart-tippy';
import { BubbleChartWrapperComponent } from './components/bubble-chart-wrapper/bubble-chart-wrapper';
import { SmartBreadcrumbsComponent } from './components/smart-breadcrumbs/smart-breadcrumbs';
import { ConfigurationService } from '../common/services/configuration.service';
import apolloConfig from './config/apollo.config';

const COMPONENTS = [
  AwEntitaLayoutComponent,
  AwHomeLayoutComponent,
  AwSchedaLayoutComponent,
  AwSearchLayoutComponent,
  AwGalleryLayoutComponent,
  BubbleChartWrapperComponent,
  ChartTippyComponent,
  SmartBreadcrumbsComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    RouterModule,
    DvComponentsLibModule,
    N7BoilerplateCommonModule,
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
      communication.providers.apollo.config = apolloConfig;
      config.set('communication', communication);
    });
  }
}

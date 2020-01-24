// MODULES
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateCommonModule } from '../common/n7-boilerplate-common.module';
// LAYOUTS
import { AwEntitaLayoutComponent } from './layouts/entita-layout/entita-layout';
import { AwHomeLayoutComponent } from './layouts/home-layout/home-layout';
import { AwSchedaLayoutComponent } from './layouts/scheda-layout/scheda-layout';
import { AwSearchLayoutComponent } from './layouts/search-layout/search-layout';
// COMPONENTS
import { ChartTippyComponent } from './components/chart-tippy/chart-tippy';
import { BubbleChartWrapperComponent } from './components/bubble-chart-wrapper/bubble-chart-wrapper';
import { SmartBreadcrumbsComponent } from './components/smart-breadcrumbs/smart-breadcrumbs';

const COMPONENTS = [
  AwEntitaLayoutComponent,
  AwHomeLayoutComponent,
  AwSchedaLayoutComponent,
  AwSearchLayoutComponent,
  BubbleChartWrapperComponent,
  ChartTippyComponent,
  SmartBreadcrumbsComponent
];


@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    RouterModule,
    DvComponentsLibModule,
    N7BoilerplateCommonModule,
  ],
  providers: [],
  exports: COMPONENTS
})
export class N7BoilerplateAriannaWebModule { }

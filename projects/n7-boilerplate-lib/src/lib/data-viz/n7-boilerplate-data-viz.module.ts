// MODULES
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateCommonModule } from '../common/n7-boilerplate-common.module';
//COMPONENTS
import { DataWidgetWrapperComponent } from './components/data-widget-wrapper/data-widget-wrapper';
// LAYOUTS
import { DvExampleLayoutComponent } from './layout/example-layout/example-layout';

const COMPONENTS = [
  DataWidgetWrapperComponent,
  DvExampleLayoutComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    DvComponentsLibModule,
    N7BoilerplateCommonModule,
  ],
  providers: [],
  exports: COMPONENTS
})
export class N7BoilerplateDataVizModule { }
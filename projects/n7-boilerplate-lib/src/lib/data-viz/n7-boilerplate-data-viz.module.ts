// MODULES
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateCommonModule } from '../common/n7-boilerplate-common.module';
// COMPONENTS
import { DataWidgetWrapperComponent } from './components/data-widget-wrapper/data-widget-wrapper';
import { DatepickerWrapperComponent } from './components/datepicker-wrapper/datepicker-wrapper';
import { CardComponent } from './components/card/card';
// LAYOUTS
import { DvExampleLayoutComponent } from './layout/example-layout/example-layout';
import { DvCardExampleLayoutComponent } from './layout/card-example-layout/card-example-layout';

const COMPONENTS = [
  DataWidgetWrapperComponent,
  DatepickerWrapperComponent,
  CardComponent,
  DvExampleLayoutComponent,
  DvCardExampleLayoutComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    DvComponentsLibModule,
    N7BoilerplateCommonModule,
  ],
  providers: [],
  entryComponents: COMPONENTS,
  exports: COMPONENTS,
})
export class N7BoilerplateDataVizModule { }

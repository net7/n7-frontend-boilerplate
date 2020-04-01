import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { N7BoilerplateCommonModule } from './common/n7-boilerplate-common.module';
import { N7BoilerplateAriannaWebModule } from './arianna-web/n7-boilerplate-arianna-web.module';
import { N7BoilerplateDataVizModule } from './data-viz/n7-boilerplate-data-viz.module';
import { N7BoilerplateMurucaModule } from './muruca/n7-boilerplate-muruca.module';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [],
  exports: [
    // COMMON
    N7BoilerplateCommonModule,
    // AW
    N7BoilerplateAriannaWebModule,
    // DV
    N7BoilerplateDataVizModule,
    // MR
    N7BoilerplateMurucaModule,
  ],
})
export class N7BoilerplateLibModule { }

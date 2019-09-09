import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { N7BoilerplateCommonModule } from './common/n7-boilerplate-common.module';
import { N7BoilerplateAriannaWebModule } from './arianna-web/n7-boilerplate-arianna-web.module';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [],
  exports: [
    N7BoilerplateCommonModule,
    N7BoilerplateAriannaWebModule,
  ]
})
export class N7BoilerplateLibModule { }

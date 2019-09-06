import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { N7BoilerplateCommonModule } from './common/n7-boilerplate-common.module';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [],
  exports: [
    N7BoilerplateCommonModule
  ]
})
export class N7BoilerplateLibModule { }

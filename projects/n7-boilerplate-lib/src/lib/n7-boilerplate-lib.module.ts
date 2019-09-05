import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateLibComponent } from './n7-boilerplate-lib.component';
import { MainLayoutComponent } from '@lib/layouts/main-layout/main-layout';

const COMPONENTS = [
  N7BoilerplateLibComponent,
  MainLayoutComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    DvComponentsLibModule
  ],
  exports: COMPONENTS
})
export class N7BoilerplateLibModule { }

// MODULES
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateCommonModule } from '../common/n7-boilerplate-common.module';
// LAYOUTS
import { AwHomeLayoutComponent } from './layouts/home-layout/home-layout';
import { AwAboutLayoutComponent } from './layouts/about-layout/about-layout';
import { AwWorksLayoutComponent } from './layouts/works-layout/works-layout';
import { AwPatrimonioLayoutComponent } from './layouts/patrimonio-layout/patrimonio-layout';

const COMPONENTS = [
  AwHomeLayoutComponent,
  AwAboutLayoutComponent,
  AwWorksLayoutComponent,
  AwPatrimonioLayoutComponent,
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
export class N7BoilerplateAriannaWebModule { }

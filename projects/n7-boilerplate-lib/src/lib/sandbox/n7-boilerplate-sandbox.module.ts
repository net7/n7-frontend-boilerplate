// MODULES
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateCommonModule } from '../common/n7-boilerplate-common.module';
// LAYOUTS
import { SbExampleLayoutComponent } from './layout/example-layout/example-layout';
import { SbImageViewerLayoutComponent } from './layout/image-viewer-layout/image-viewer-layout';

const COMPONENTS = [
  SbExampleLayoutComponent,
  SbImageViewerLayoutComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    DvComponentsLibModule,
    N7BoilerplateCommonModule,
  ],
  providers: [],
  exports: COMPONENTS,
})
export class N7BoilerplateSandboxModule { }

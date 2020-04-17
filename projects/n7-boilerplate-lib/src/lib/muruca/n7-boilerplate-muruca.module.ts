// MODULES
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateCommonModule } from '../common/n7-boilerplate-common.module';
// LAYOUTS
import { MrHomeLayoutComponent } from './layouts/home-layout/home-layout';
import { MrSearchLayoutComponent } from './layouts/search-layout/search-layout';
import { MrGlossaryLayoutComponent } from './layouts/glossary-layout/glossary-layout';
import { MrStaticLayoutComponent } from './layouts/static-layout/static-layout';
import { MrSearchFacetsLayoutComponent } from './layouts/search-facets-layout/search-facets-layout';
import { MrSearchTestLayoutComponent } from './layouts/search-test-layout/search-test-layout';

const COMPONENTS = [
  MrHomeLayoutComponent,
  MrSearchLayoutComponent,
  MrGlossaryLayoutComponent,
  MrStaticLayoutComponent,
  MrSearchFacetsLayoutComponent,
  MrSearchTestLayoutComponent,
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
export class N7BoilerplateMurucaModule { }

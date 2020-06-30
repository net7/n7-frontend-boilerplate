// MODULES
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateCommonModule } from '../common/n7-boilerplate-common.module';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
// LAYOUTS
import { MrGlossaryLayoutComponent } from './layouts/glossary-layout/glossary-layout';
import { MrHomeLayoutComponent } from './layouts/home-layout/home-layout';
import { MrResourceLayoutComponent } from './layouts/resource-layout/resource-layout';
import { MrSearchFacetsLayoutComponent } from './layouts/search-facets-layout/search-facets-layout';
import { MrSearchLayoutComponent } from './layouts/search-layout/search-layout';
import { MrSearchService } from './services/search.service';
import { MrLayoutStateService } from './services/layout-state.service';
import { MrStaticLayoutComponent } from './layouts/static-layout/static-layout';
// COMPONENTS
import { ReadMoreComponent } from './components/read-more/read-more';

const COMPONENTS = [
  // Layout components
  MrGlossaryLayoutComponent,
  MrHomeLayoutComponent,
  MrResourceLayoutComponent,
  MrSearchFacetsLayoutComponent,
  MrSearchLayoutComponent,
  MrStaticLayoutComponent,
  // Custom components
  ReadMoreComponent
];

@NgModule({
  declarations: [
    EscapeHtmlPipe,
    COMPONENTS
  ],
  imports: [
    CommonModule,
    DvComponentsLibModule,
    N7BoilerplateCommonModule,
  ],
  providers: [
    MrSearchService,
    MrLayoutStateService
  ],
  entryComponents: COMPONENTS,
  exports: COMPONENTS,
})
export class N7BoilerplateMurucaModule { }

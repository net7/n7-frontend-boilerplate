// MODULES
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateCommonModule } from '../common/n7-boilerplate-common.module';
// SERVICES
import { MrSearchService } from './services/search.service';
import { MrLayoutStateService } from './services/layout-state.service';
// PIPES
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
// LAYOUTS
import { MrGlossaryLayoutComponent } from './layouts/glossary-layout/glossary-layout';
import { MrHomeLayoutComponent } from './layouts/home-layout/home-layout';
import { MrResourceLayoutComponent } from './layouts/resource-layout/resource-layout';
import { MrSearchFacetsLayoutComponent } from './layouts/search-facets-layout/search-facets-layout';
import { MrSearchLayoutComponent } from './layouts/search-layout/search-layout';
import { MrStaticLayoutComponent } from './layouts/static-layout/static-layout';
import { MrAdvancedSearchLayoutComponent } from './layouts/advanced-search-layout/advanced-search-layout';
// COMPONENTS
import { ReadMoreComponent } from './components/read-more/read-more';
import { MrFormComponent } from './components/form/form';

const COMPONENTS = [
  // Layout components
  MrGlossaryLayoutComponent,
  MrHomeLayoutComponent,
  MrResourceLayoutComponent,
  MrSearchFacetsLayoutComponent,
  MrSearchLayoutComponent,
  MrStaticLayoutComponent,
  MrAdvancedSearchLayoutComponent,
  // Custom components
  ReadMoreComponent,
  MrFormComponent,
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

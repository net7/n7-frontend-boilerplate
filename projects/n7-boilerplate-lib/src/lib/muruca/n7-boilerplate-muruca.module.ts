// MODULES
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateCommonModule } from '../common/n7-boilerplate-common.module';
// SERVICES
import { MrSearchService } from './services/search.service';
import { MrLayoutStateService } from './services/layout-state.service';
import { MrResourceModalService } from './services/resource-modal.service';
// PIPES
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
// LAYOUTS
import { MrAdvancedResultsLayoutComponent } from './layouts/advanced-results-layout/advanced-results-layout';
import { MrAdvancedSearchLayoutComponent } from './layouts/advanced-search-layout/advanced-search-layout';
import { MrGlossaryLayoutComponent } from './layouts/glossary-layout/glossary-layout';
import { MrHomeLayoutComponent } from './layouts/home-layout/home-layout';
import { MrItineraryLayoutComponent } from './layouts/itinerary-layout/itinerary-layout';
import { MrMapLayoutComponent } from './layouts/map-layout/map-layout';
import { MrPostsLayoutComponent } from './layouts/posts-layout/posts-layout';
import { MrResourceLayoutComponent } from './layouts/resource-layout/resource-layout';
import { MrSearchFacetsLayoutComponent } from './layouts/search-facets-layout/search-facets-layout';
import { MrSearchLayoutComponent } from './layouts/search-layout/search-layout';
import { MrStaticLayoutComponent } from './layouts/static-layout/static-layout';
import { MrTimelineLayoutComponent } from './layouts/timeline-layout/timeline-layout';
// COMPONENTS
import { ReadMoreComponent } from './components/read-more/read-more';
import { MrAdvancedResultComponent } from './components/advanced-result/advanced-result';
import { MrFormComponent } from './components/form/form';
import { MrFormWrapperAccordionComponent } from './components/form-wrapper-accordion/form-wrapper-accordion';
import { MrSearchPageDescriptionComponent } from './components/search-page-description/search-page-description';
import { MrResourceModalComponent } from './components/resource-modal/resource-modal';
import { MrGalleryComponent } from './components/gallery/gallery';

const COMPONENTS = [
  // Layout components
  MrAdvancedResultsLayoutComponent,
  MrAdvancedSearchLayoutComponent,
  MrGlossaryLayoutComponent,
  MrHomeLayoutComponent,
  MrItineraryLayoutComponent,
  MrMapLayoutComponent,
  MrPostsLayoutComponent,
  MrResourceLayoutComponent,
  MrSearchFacetsLayoutComponent,
  MrSearchLayoutComponent,
  MrStaticLayoutComponent,
  MrTimelineLayoutComponent,
  // Custom components
  ReadMoreComponent,
  MrFormComponent,
  MrFormWrapperAccordionComponent,
  MrSearchPageDescriptionComponent,
  MrResourceModalComponent,
  MrGalleryComponent,
  MrAdvancedResultComponent,
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
    MrLayoutStateService,
    MrResourceModalService
  ],
  exports: COMPONENTS
})
export class N7BoilerplateMurucaModule { }

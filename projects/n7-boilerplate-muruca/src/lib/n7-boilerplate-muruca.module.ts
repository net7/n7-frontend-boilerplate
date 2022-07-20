// MODULES
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DvComponentsLibModule } from '@net7/components';
import { MainStateService, N7BoilerplateCommonModule } from '@net7/boilerplate-common';
// SERVICES
import { MrSearchService } from './services/search.service';
import { MrLayoutStateService } from './services/layout-state.service';
import { MrResourceModalService } from './services/resource-modal.service';
import { MrLocaleService } from './services/locale.service';
// PIPES
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
// LAYOUTS
import { MrAdvancedResultsLayoutComponent } from './layouts/advanced-results-layout/advanced-results-layout';
import { MrAdvancedSearchLayoutComponent } from './layouts/advanced-search-layout/advanced-search-layout';
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
import { MrAdvancedResultComponent } from './components/advanced-result/advanced-result';
import { MrFormComponent } from './components/form/form';
import { MrFormWrapperAccordionComponent } from './components/form-wrapper-accordion/form-wrapper-accordion';
import { MrGalleryComponent } from './components/gallery/gallery';
import { MrMetadataReadmoreComponent } from './components/metadata-with-readmore/metadata-with-readmore';
import { MrResourceModalComponent } from './components/resource-modal/resource-modal';
import { MrSearchPageDescriptionComponent } from './components/search-page-description/search-page-description';
import { ReadMoreComponent } from './components/read-more/read-more';

const COMPONENTS = [
  // Layout components
  MrAdvancedResultsLayoutComponent,
  MrAdvancedSearchLayoutComponent,
  MrHomeLayoutComponent,
  MrItineraryLayoutComponent,
  MrMapLayoutComponent,
  MrMetadataReadmoreComponent,
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
    MrResourceModalService,
    MrLocaleService
  ],
  exports: COMPONENTS
})
export class N7BoilerplateMurucaModule {
  constructor(
    private localeService: MrLocaleService,
    private mainState: MainStateService,
    private router: Router,
  ) {
    // listen to locale (language select) change event
    this.mainState.get$('footerEvents').subscribe(({ type, payload }) => {
      if (type === 'footer.change' && payload?.inputPayload === 'locale') {
        const currentLocale = this.localeService.getLocale();
        const { value } = payload;
        if (currentLocale !== value) {
          const href = this.localeService.getLinkByLocale(value);
          if (href) {
            this.router.navigate([href]);
          }
        }
      }
    });
  }
}

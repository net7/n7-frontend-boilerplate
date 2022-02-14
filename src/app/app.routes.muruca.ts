import { Routes } from '@angular/router';

import { Page404LayoutComponent } from '@net7/boilerplate-common';
import {
  MrHomeLayoutComponent,
  MrSearchLayoutComponent,
  MrStaticLayoutComponent,
  MrResourceLayoutComponent,
  MrAdvancedSearchLayoutComponent,
  MrAdvancedResultsLayoutComponent,
  MrItineraryLayoutComponent,
  MrPostsLayoutComponent,
  MrTimelineLayoutComponent,
  MrMapLayoutComponent,
  // DynamicPathGuard,
} from '@net7/boilerplate-muruca';

const NOT_FOUND_PATH = 'page-404';

export const APP_ROUTES: Routes = [
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  { path: '', component: MrHomeLayoutComponent, data: { configId: 'home' } },
  { path: 'opere', component: MrSearchLayoutComponent, data: { configId: 'search-works' } },
  { path: 'atti', component: MrSearchLayoutComponent, data: { configId: 'search-acts' } },
  { path: 'biblioteca', component: MrSearchLayoutComponent, data: { configId: 'search-books' } },
  { path: 'work/:id/:slug', redirectTo: 'opera/:id/:slug' },
  { path: 'libro/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-book' } },
  { path: 'opera/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-work' } },
  { path: 'toponym/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-toponym' } },
  { path: 'keyword/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-keyword' } },
  { path: 'testimone/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-witness' } },
  { path: 'testimoni', component: MrSearchLayoutComponent, data: { configId: 'search-witnesses' } },
  { path: 'timeline/:id/:slug', component: MrTimelineLayoutComponent, data: { configId: 'timeline' } },
  { path: 'timeline/:id', component: MrTimelineLayoutComponent, data: { configId: 'timeline' } },
  { path: 'timeline', redirectTo: 'timeline/' },
  { path: 'map/:id/:slug', component: MrMapLayoutComponent, data: { configId: 'map' } },
  { path: 'map/:id', component: MrMapLayoutComponent, data: { configId: 'map' } },
  { path: 'map', redirectTo: 'map/' },
  { path: 'posts', component: MrPostsLayoutComponent, data: { configId: 'posts' } },
  { path: 'post/:slug', component: MrStaticLayoutComponent },
  { path: 'advanced-search', component: MrAdvancedSearchLayoutComponent, data: { configId: 'advanced-search' } },
  { path: 'advanced-search-full', component: MrAdvancedSearchLayoutComponent, data: { configId: 'advanced-search-full' } },
  { path: 'advanced-results', component: MrAdvancedResultsLayoutComponent, data: { configId: 'advanced-results' } },
  { path: 'itinerary/:id/:slug', component: MrItineraryLayoutComponent, data: { configId: 'itinerary' } },
  { path: NOT_FOUND_PATH, component: Page404LayoutComponent, data: { id: 'page-404' } },
  {
    path: '**',
    component: MrStaticLayoutComponent,
    canActivate: [],
    data: {
      notFoundPath: NOT_FOUND_PATH
    }
  }
];

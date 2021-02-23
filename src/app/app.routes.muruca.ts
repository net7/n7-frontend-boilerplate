import { Routes } from '@angular/router';

import {
  // COMMON
  Page404LayoutComponent,
  // MURUCA
  MrHomeLayoutComponent,
  MrSearchLayoutComponent,
  MrStaticLayoutComponent,
  MrResourceLayoutComponent,
  MrAdvancedSearchLayoutComponent,
  MrAdvancedResultsLayoutComponent,
  // DynamicPathGuard,
  MrPostsLayoutComponent
} from 'n7-boilerplate-lib';
import { MrTimelineLayoutComponent } from 'n7-boilerplate-lib/lib/muruca/layouts/timeline-layout/timeline-layout';

const NOT_FOUND_PATH = 'page-404';

export const APP_ROUTES: Routes = [
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  { path: '', component: MrHomeLayoutComponent, data: { configId: 'home' } },
  { path: 'opere', component: MrSearchLayoutComponent, data: { configId: 'search-works' } },
  { path: 'biblioteca', component: MrSearchLayoutComponent, data: { configId: 'search-books' } },
  { path: 'libro/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-book' } },
  { path: 'opera/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-work' } },
  { path: 'toponym/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-toponym' } },
  { path: 'keyword/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-keyword' } },
  { path: 'testimone/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-witness' } },
  { path: 'testimoni', component: MrSearchLayoutComponent, data: { configId: 'search-witnesses' } },
  { path: 'timeline/:id/:slug', component: MrTimelineLayoutComponent, data: { configId: 'timeline' } },
  { path: 'timeline/:id', component: MrTimelineLayoutComponent, data: { configId: 'timeline' } },
  { path: 'timeline', redirectTo: 'timeline/' },
  { path: 'posts', component: MrPostsLayoutComponent, data: { configId: 'posts' } },
  { path: 'post/:slug', component: MrStaticLayoutComponent },
  { path: 'advanced-search', component: MrAdvancedSearchLayoutComponent, data: { configId: 'advanced-search' } },
  { path: 'advanced-search-full', component: MrAdvancedSearchLayoutComponent, data: { configId: 'advanced-search-full' } },
  { path: 'advanced-results', component: MrAdvancedResultsLayoutComponent, data: { configId: 'advanced-results' } },
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

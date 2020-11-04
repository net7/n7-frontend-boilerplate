import { Routes } from '@angular/router';

import {
  // COMMON
  Page404LayoutComponent,
  // MURUCA
  MrHomeLayoutComponent,
  MrSearchLayoutComponent,
  MrStaticLayoutComponent,
  MrResourceLayoutComponent,
  // OTHER
  DynamicPathGuard
} from 'n7-boilerplate-lib';
import { MrAdvancedSearchLayoutComponent } from 'n7-boilerplate-lib/lib/muruca/layouts/advanced-search-layout/advanced-search-layout';

const NOT_FOUND_PATH = 'page-404';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: MrHomeLayoutComponent, data: { configId: 'home-base' } },
  { path: 'home-pro', component: MrHomeLayoutComponent, data: { configId: 'home-pro' } },
  { path: 'works', component: MrSearchLayoutComponent, data: { configId: 'search-works' } },
  { path: 'maps', component: MrSearchLayoutComponent, data: { configId: 'search-maps' } },
  { path: 'map/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-map' } },
  { path: 'work/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-work' } },
  { path: 'toponym/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-toponym' } },
  { path: 'keyword/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-keyword' } },
  { path: 'work/:id/:slug/facsimile', component: MrResourceLayoutComponent, data: { configId: 'resource-work-facsimile' } },
  { path: 'work/:id/:slug/metadati', component: MrResourceLayoutComponent, data: { configId: 'resource-work-metadati' } },
  { path: 'work/:id/:slug/trascrizione', component: MrResourceLayoutComponent, data: { configId: 'resource-work-trascrizione' } },
  { path: 'work/:id/:slug/bibliografia', component: MrResourceLayoutComponent, data: { configId: 'resource-work-bibliografia' } },
  { path: 'work/:id/:slug/sandbox', component: MrResourceLayoutComponent, data: { configId: 'resource-work-sandbox' } },
  { path: 'advanced-search', component: MrAdvancedSearchLayoutComponent, data: { configId: 'advanced-search' } },
  { path: NOT_FOUND_PATH, component: Page404LayoutComponent },
  {
    path: '**',
    component: MrStaticLayoutComponent,
    canActivate: [DynamicPathGuard],
    data: {
      notFoundPath: NOT_FOUND_PATH
    }
  }
];

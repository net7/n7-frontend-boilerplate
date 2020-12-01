import { Routes } from '@angular/router';

import {
  // COMMON
  Page404LayoutComponent,
  // MURUCA
  MrHomeLayoutComponent,
  MrSearchLayoutComponent,
  MrStaticLayoutComponent,
  MrResourceLayoutComponent,
  // MrAdvancedSearchLayoutComponent,
  // OTHER
  DynamicPathGuard
} from 'n7-boilerplate-lib';

const NOT_FOUND_PATH = 'page-404';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: MrHomeLayoutComponent, data: { configId: 'home' } },
  { path: 'opere', component: MrSearchLayoutComponent, data: { configId: 'search-works' } },
  { path: 'biblioteca', component: MrSearchLayoutComponent, data: { configId: 'search-books' } },
  { path: 'libro/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-book' } },
  { path: 'opera/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-work' } },
  { path: 'toponym/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-toponym' } },
  { path: 'keyword/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-keyword' } },
  { path: 'testimone/:id/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-witness' } },
  { path: 'testimoni', component: MrSearchLayoutComponent, data: { configId: 'search-witnesses' } },
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

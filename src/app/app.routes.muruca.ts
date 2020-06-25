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

const NOT_FOUND_PATH = 'page-404';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: MrHomeLayoutComponent, data: { configId: 'home-base' } },
  { path: 'home-pro', component: MrHomeLayoutComponent, data: { configId: 'home-pro' } },
  { path: 'opere', component: MrSearchLayoutComponent, data: { configId: 'search-works' } },
  { path: 'mappe', component: MrSearchLayoutComponent, data: { configId: 'search-maps' } },
  { path: 'mappa/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-map' } },
  { path: 'opera/:slug', component: MrResourceLayoutComponent, data: { configId: 'resource-work' } },
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

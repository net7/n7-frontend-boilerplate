
import { Routes } from '@angular/router';

import {
  // COMMON
  Page404LayoutComponent,
  // MURUCA
  MrHomeLayoutComponent,
  MrSearchLayoutComponent,
  MrGlossaryLayoutComponent,
  MrStaticLayoutComponent,
  MrResourceLayoutComponent
} from 'n7-boilerplate-lib';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: MrHomeLayoutComponent, data: { configId: 'home-base' } },
  { path: 'home-pro', component: MrHomeLayoutComponent, data: { configId: 'home-pro' } },
  { path: 'search', component: MrSearchLayoutComponent, data: { configId: 'search-works' } },
  { path: 'mappe', component: MrSearchLayoutComponent, data: { configId: 'search-works' } },
  { path: 'opere', component: MrSearchLayoutComponent, data: { configId: 'search-works' } },
  { path: 'glossary', component: MrGlossaryLayoutComponent },
  { path: 'resource', component: MrResourceLayoutComponent },
  { path: 'toponimia', component: MrGlossaryLayoutComponent },
  { path: 'static/:slug', component: MrStaticLayoutComponent },
  { path: 'progetto', component: MrStaticLayoutComponent },
  { path: '**', component: Page404LayoutComponent }
];


import { Routes } from '@angular/router';

import {
  // COMMON
  Page404LayoutComponent,
  // MURUCA
  MrHomeLayoutComponent,
  MrSearchLayoutComponent,
  MrGlossaryLayoutComponent,
  MrStaticLayoutComponent
} from 'n7-boilerplate-lib';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/home-base',
    pathMatch: 'full'
  },
  { path: 'home-base', component: MrHomeLayoutComponent, data: { configId: 'home-base' } },
  { path: 'home-pro', component: MrHomeLayoutComponent, data: { configId: 'home-pro' } },
  { path: 'mappe', component: MrSearchLayoutComponent, data: { configId: 'search-works' } },
  { path: 'opere', component: MrSearchLayoutComponent, data: { configId: 'search-works' } },
  { path: 'glossary', component: MrGlossaryLayoutComponent },
  { path: 'toponimia', component: MrGlossaryLayoutComponent },
  { path: 'static/:slug', component: MrStaticLayoutComponent },
  { path: 'progetto', component: MrStaticLayoutComponent },
  { path: '**', component: Page404LayoutComponent }
];


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
    redirectTo: '/mr/home-base',
    pathMatch: 'full'
  },
  { path: 'mr/home-base', component: MrHomeLayoutComponent, data: { configId: 'home-base' } },
  { path: 'mr/home-pro', component: MrHomeLayoutComponent, data: { configId: 'home-pro' } },
  { path: 'mr/mappe', component: MrSearchLayoutComponent, data: { configId: 'search-maps' } },
  { path: 'mr/opere', component: MrSearchLayoutComponent, data: { configId: 'search-works' } },
  { path: 'mr/glossary', component: MrGlossaryLayoutComponent },
  { path: 'mr/toponimia', component: MrGlossaryLayoutComponent },
  { path: 'mr/static/:page', component: MrStaticLayoutComponent },
  { path: 'mr/progetto', component: MrStaticLayoutComponent },
  { path: '**', component: Page404LayoutComponent }
];

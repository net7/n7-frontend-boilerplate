import { Routes } from '@angular/router';

import {
  // COMMON
  Page404LayoutComponent,
  // AW
  AwEntitaLayoutComponent,
  AwGalleryLayoutComponent,
  AwHomeLayoutComponent,
  AwSchedaLayoutComponent,
  AwSearchLayoutComponent,
  AwTimelineLayoutComponent,
  AwMapLayoutComponent
} from 'n7-boilerplate-lib';

export const APP_ROUTES: Routes = [
  // arianna web routes
  { path: 'aw/home', component: AwHomeLayoutComponent },
  { path: 'aw/patrimonio/:id/:slug', component: AwSchedaLayoutComponent },
  { path: 'aw/patrimonio/:id', component: AwSchedaLayoutComponent },
  { path: 'aw/patrimonio', redirectTo: 'aw/patrimonio/' },
  { path: 'aw/entita/:id/:slug/:tab', component: AwEntitaLayoutComponent },
  { path: 'aw/entita/:id/:slug', redirectTo: 'aw/entita/:id/:slug/informazioni' },
  { path: 'aw/ricerca', component: AwSearchLayoutComponent },
  { path: 'aw/galleria', component: AwGalleryLayoutComponent },
  { path: 'aw/mappa', component: AwMapLayoutComponent },
  { path: 'aw/timeline/:id/:slug', component: AwTimelineLayoutComponent },
  {
    path: '',
    redirectTo: '/aw/home',
    pathMatch: 'full'
  },

  // page404
  { path: '**', component: Page404LayoutComponent }
];

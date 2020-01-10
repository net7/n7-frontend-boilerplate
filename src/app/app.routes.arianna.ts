
import { Routes } from '@angular/router';

import {
  //COMMON
  Page404LayoutComponent,
  //AW
  AwHomeLayoutComponent,
  AwSchedaLayoutComponent,
  AwEntitaLayoutComponent,
  AwSearchLayoutComponent,
  AwGalleryLayoutComponent
} from 'n7-boilerplate-lib';

export const APP_ROUTES: Routes = [
  // arianna web routes
  { path: 'aw/home', component: AwHomeLayoutComponent },
  { path: 'aw/patrimonio/:id/:slug', component: AwSchedaLayoutComponent },
  { path: 'aw/patrimonio/:id', component: AwSchedaLayoutComponent },
  { path: 'aw/patrimonio', redirectTo: 'aw/patrimonio/' },
  { path: 'aw/entita/:id/:slug/:tab', component: AwEntitaLayoutComponent},
  { path: 'aw/entita/:id/:slug', redirectTo: 'aw/entita/:id/:slug/overview' },
  { path: 'aw/ricerca', component: AwSearchLayoutComponent },
  { path: 'aw/galleria', component: AwGalleryLayoutComponent },
  {
    path: '',
    redirectTo: '/aw/home',
    pathMatch: 'full'
  },

  // page404
  { path: '**', component: Page404LayoutComponent }
];

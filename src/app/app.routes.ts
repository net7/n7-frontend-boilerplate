
import { Routes } from '@angular/router';

import {
  //COMMON
  Page404LayoutComponent,
  //AW
  AwHomeLayoutComponent,
  AwSchedaLayoutComponent,
  AwEntitaLayoutComponent,
  AwSearchLayoutComponent,
  //DV
  DvExampleLayoutComponent,
  AwGalleryLayoutComponent,
} from 'n7-boilerplate-lib';

export const APP_ROUTES: Routes = [
  // arianna web routes
  { path: 'aw/home', component: AwHomeLayoutComponent },
  { path: 'aw/patrimonio/:id', component: AwSchedaLayoutComponent },
  { path: 'aw/patrimonio', redirectTo: 'aw/patrimonio/' },
  { path: 'aw/entita/:id/:tab/:page', component: AwEntitaLayoutComponent},
  { path: 'aw/entita/:id/:tab', component: AwEntitaLayoutComponent},
  { path: 'aw/entita/:id', redirectTo: 'aw/entita/:id/overview' },
  { path: 'aw/ricerca', component: AwSearchLayoutComponent },
  { path: 'aw/galleria', component: AwGalleryLayoutComponent },
  {
    path: '',
    redirectTo: '/aw/home',
    pathMatch: 'full'
  },

  //DataViz routes
  { path: 'dv/example', component: DvExampleLayoutComponent },

  

  // altri moduli...

  // page404
  { path: '**', component: Page404LayoutComponent }
];

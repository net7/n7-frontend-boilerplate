
import { Routes } from '@angular/router';
import {
  Page404LayoutComponent,
  AwHomeLayoutComponent,
  AwAboutLayoutComponent,
  AwSchedaLayoutComponent,
  AwWorksLayoutComponent,
  AwEntitaLayoutComponent,
  AwSearchLayoutComponent,
} from 'n7-boilerplate-lib';

export const APP_ROUTES: Routes = [
  // arianna web routes
  { path: 'aw/home', component: AwHomeLayoutComponent },
  { path: 'aw/about', component: AwAboutLayoutComponent },
  { path: 'aw/patrimonio/:id', component: AwSchedaLayoutComponent },
  { path: 'aw/patrimonio', redirectTo: 'aw/patrimonio/' },
  { path: 'aw/works', component: AwWorksLayoutComponent },
  { path: 'aw/entita/:id/:tab/:page', component: AwEntitaLayoutComponent},
  { path: 'aw/entita/:id/oggetti-collegati', redirectTo: 'aw/entita/:id/oggetti-collegati/1' },
  { path: 'aw/entita/:id/:tab', component: AwEntitaLayoutComponent},
  { path: 'aw/entita/:id', redirectTo: 'aw/entita/:id/overview' },
  { path: 'aw/search', component: AwSearchLayoutComponent },
  {
    path: '',
    redirectTo: '/aw/home',
    pathMatch: 'full'
  },

  // altri moduli...

  // page404
  { path: '**', component: Page404LayoutComponent }
];


import { Routes } from '@angular/router';
import {
  Page404LayoutComponent,
  AwHomeLayoutComponent,
  AwAboutLayoutComponent,
  AwPatrimonioLayoutComponent,
  AwWorksLayoutComponent,
  AwEntitaLayoutComponent,
} from 'n7-boilerplate-lib';

export const APP_ROUTES: Routes = [
  // arianna web routes
  { path: 'aw/home', component: AwHomeLayoutComponent },
  { path: 'aw/about', component: AwAboutLayoutComponent },
  { path: 'aw/patrimonio', component: AwPatrimonioLayoutComponent },
  { path: 'aw/works', component: AwWorksLayoutComponent },
  { path: 'aw/entita', component: AwEntitaLayoutComponent },
  {
    path: '',
    redirectTo: '/aw/home',
    pathMatch: 'full'
  },

  // altri moduli...

  // page404
  { path: '**', component: Page404LayoutComponent }
];

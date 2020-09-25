import { Routes } from '@angular/router';

import {
  // COMMON
  Page404LayoutComponent,
  // SB
  SbExampleLayoutComponent,
} from 'n7-boilerplate-lib';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/sb/home',
    pathMatch: 'full'
  },
  { path: 'sb/home', component: SbExampleLayoutComponent },
  { path: '**', component: Page404LayoutComponent }
];

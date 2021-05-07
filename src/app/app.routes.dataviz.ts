import { Routes } from '@angular/router';

import {
  // COMMON
  Page404LayoutComponent,
  // DV
  DvExampleLayoutComponent,
} from '@n7-frontend/boilerplate';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/dv/home',
    pathMatch: 'full'
  },
  { path: 'dv/home', component: DvExampleLayoutComponent },
  { path: '**', component: Page404LayoutComponent }
];

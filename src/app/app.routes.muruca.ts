
import { Routes } from '@angular/router';

import {
  // COMMON
  Page404LayoutComponent,
  // MURUCA
  MrHomeLayoutComponent,
} from 'n7-boilerplate-lib';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/mr/home',
    pathMatch: 'full'
  },
  { path: 'mr/home', component: MrHomeLayoutComponent },
  { path: '**', component: Page404LayoutComponent }
];

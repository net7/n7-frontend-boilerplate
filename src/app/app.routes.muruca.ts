
import { Routes } from '@angular/router';

import {
  // COMMON
  Page404LayoutComponent,
  // MURUCA
  MrHomeLayoutComponent,
} from 'n7-boilerplate-lib';

// FIXME: togliere layout search-test
import { MrSearchTestLayoutComponent } from 'n7-boilerplate-lib/lib/muruca/layouts/search-test-layout/search-test-layout';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/mr/home',
    pathMatch: 'full'
  },
  { path: 'mr/home', component: MrHomeLayoutComponent },
  // FIXME: togliere layout search-test
  { path: 'mr/search-test', component: MrSearchTestLayoutComponent },
  { path: '**', component: Page404LayoutComponent }
];

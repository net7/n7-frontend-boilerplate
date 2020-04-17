
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

// FIXME: togliere layout search-test
import { MrSearchTestLayoutComponent } from 'n7-boilerplate-lib/lib/muruca/layouts/search-test-layout/search-test-layout';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/mr/home',
    pathMatch: 'full'
  },
  { path: 'mr/home', component: MrHomeLayoutComponent },
  { path: 'mr/mappe', component: MrSearchLayoutComponent },
  { path: 'mr/search', component: MrSearchLayoutComponent },
  { path: 'mr/glossary', component: MrGlossaryLayoutComponent },
  { path: 'mr/toponimia', component: MrGlossaryLayoutComponent },
  { path: 'mr/static', component: MrStaticLayoutComponent },
  { path: 'mr/progetto', component: MrStaticLayoutComponent },
  // FIXME: togliere layout search-test
  { path: 'mr/search-test', component: MrSearchTestLayoutComponent },
  { path: '**', component: Page404LayoutComponent }
];

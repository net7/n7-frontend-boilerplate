import { Routes } from '@angular/router';

import { Page404LayoutComponent } from '@n7-frontend/boilerplate-common';
import {
  DvExampleLayoutComponent,
  DvCardExampleLayoutComponent
} from '@n7-frontend/boilerplate-dataviz';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/dv/home',
    pathMatch: 'full'
  },
  { path: 'dv/home', component: DvExampleLayoutComponent },
  { path: 'dv/card-example', component: DvCardExampleLayoutComponent, data: { configId: 'card-example' } },
  { path: '**', component: Page404LayoutComponent }
];

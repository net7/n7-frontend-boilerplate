
import { Routes } from '@angular/router';
import { 
  Page404LayoutComponent,
  AwHomeLayoutComponent,
  AwAboutLayoutComponent,
  AwWorksLayoutComponent,
} from 'n7-boilerplate-lib';

export const APP_ROUTES: Routes = [
  // arianna web routes
  { path: 'arianna-web/home-layout', component: AwHomeLayoutComponent },
  { path: 'about', component: AwAboutLayoutComponent },
  { path: 'works', component: AwWorksLayoutComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  // altri moduli...

  // page404
  { path: '**', component: Page404LayoutComponent }
];

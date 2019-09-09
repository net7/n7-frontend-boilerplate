
import { Routes } from '@angular/router';
import { 
  AwHomeLayoutComponent,
  AwAboutLayoutComponent,
  AwWorksLayoutComponent,
} from 'n7-boilerplate-lib';

export const APP_ROUTES: Routes = [
  { path: 'home', component: AwHomeLayoutComponent },
  { path: 'about', component: AwAboutLayoutComponent },
  { path: 'works', component: AwWorksLayoutComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: AwHomeLayoutComponent }
];

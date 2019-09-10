import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { 
  N7BoilerplateCommonModule,
  N7BoilerplateAriannaWebModule
} from 'n7-boilerplate-lib';
import globalConfig from './config/global';
import layoutsConfig from './config/layouts';
import { APP_ROUTES } from './app.routes';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      APP_ROUTES
    ),
    N7BoilerplateCommonModule.forRoot({
      global: globalConfig,
      layouts: layoutsConfig
    }),
    N7BoilerplateAriannaWebModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

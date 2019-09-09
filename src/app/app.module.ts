import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { N7BoilerplateCommonModule } from 'n7-boilerplate-lib';
import { N7BoilerplateAriannaWebModule } from 'n7-boilerplate-lib';
import mainConfig from './config/main.config';
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
    N7BoilerplateCommonModule.forRoot(mainConfig),
    N7BoilerplateAriannaWebModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

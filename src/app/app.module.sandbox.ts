import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  N7BoilerplateCommonModule,
  N7BoilerplateSandboxModule,
  LocalConfigService,
} from 'n7-boilerplate-lib';
import globalConfig from './config/global';
import layoutsConfig from './config/layouts';
import { APP_ROUTES } from './app.routes.sandbox';

import { AppComponent } from './app.component';

import configSandbox from './config-sandbox';

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
    N7BoilerplateSandboxModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: (
      localConfigService: LocalConfigService
    ) => () => localConfigService.load(configSandbox),
    deps: [LocalConfigService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

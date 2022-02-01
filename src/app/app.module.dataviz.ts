import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  N7BoilerplateCommonModule,
  N7BoilerplateDataVizModule,
  LocalConfigService,
  JsonConfigService,
} from '@n7-frontend/boilerplate';
import { APP_ROUTES } from './app.routes.dataviz';

import { AppComponent } from './app.component-dataviz';

import configDataviz from './config-dataviz';

const JSON_PATH = './assets/app-config.local.json';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      APP_ROUTES
    ),
    N7BoilerplateCommonModule.forRoot(),
    N7BoilerplateDataVizModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: (
      localConfigService: LocalConfigService,
      jsonConfigService: JsonConfigService
    ) => () => (
      localConfigService.load(configDataviz)
        .then(() => jsonConfigService.load(JSON_PATH))
    ),
    deps: [LocalConfigService, JsonConfigService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

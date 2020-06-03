import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  N7BoilerplateCommonModule,
  N7BoilerplateMurucaModule,
  JsonConfigService,
  MrMenuService,
} from 'n7-boilerplate-lib';
import globalConfig from './config/global';
import layoutsConfig from './config/layouts';
import { APP_ROUTES } from './app.routes.muruca';

import { AppComponent } from './app.component';

const JSON_PATH = './assets/app-config.json';
const MENU_PATH = 'http://unus-sls.netseven.it/get_menu';

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
    N7BoilerplateMurucaModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: (jsonConfigService: JsonConfigService) => () => jsonConfigService.load(JSON_PATH),
    deps: [JsonConfigService],
    multi: true
  }, {
    provide: APP_INITIALIZER,
    useFactory: (menuService: MrMenuService) => () => menuService.load(MENU_PATH, 'static'),
    deps: [MrMenuService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

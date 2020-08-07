import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  N7BoilerplateCommonModule,
  N7BoilerplateMurucaModule,
  LocalConfigService,
  MrMenuService,
  MainStateService,
} from 'n7-boilerplate-lib';
import globalConfig from './config/global';
import layoutsConfig from './config/layouts';
import { APP_ROUTES } from './app.routes.muruca';

import { AppComponent } from './app.component';
import configMuruca from './config-muruca';

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
    useFactory: (
      localConfigService: LocalConfigService
    ) => () => localConfigService.load(configMuruca),
    deps: [LocalConfigService],
    multi: true
  }, {
    provide: APP_INITIALIZER,
    useFactory: (menuService: MrMenuService) => () => menuService.load(MENU_PATH),
    deps: [MrMenuService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private router: Router,
    private mainState: MainStateService
  ) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
    ).subscribe((event: any) => {
      const { url } = event;
      this.mainState.updateCustom('currentNav', url);
    });
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import {
  RouterModule, Router, NavigationStart, RoutesRecognized
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { translate } from '@net7/core';
import {
  N7BoilerplateCommonModule,
  LocalConfigService,
  MainStateService,
  ConfigurationService,
  JsonConfigService,
} from '@net7/boilerplate-common';
import {
  N7BoilerplateMurucaModule,
  MrCopyProtectionService,
} from '@net7/boilerplate-muruca';

import { APP_ROUTES } from '@mr-routes';
import configMuruca from '@mr-config';
import layoutsConfig from '@mr-config/layouts';
import i18n from '@mr-config/i18n';

import { AppComponent } from './app.component-muruca';

const LANG_CODE = 'it';

const JSON_PATH = './assets/app-config.local.json';

// FIXME: togliere
if ('it_IT' in i18n) {
  (i18n as any).it = (i18n as any).it_IT;
}

// load translations
translate.init({
  defaultLang: LANG_CODE,
  translations: i18n
});

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
      layouts: layoutsConfig
    }),
    N7BoilerplateMurucaModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: (
      localConfigService: LocalConfigService,
      jsonConfigService: JsonConfigService,
      copyProtectionService: MrCopyProtectionService,
    ) => () => (
      localConfigService.load(configMuruca)
        .then(() => jsonConfigService.load(JSON_PATH))
        .then(() => { copyProtectionService.init(); })
    ),
    deps: [
      LocalConfigService,
      JsonConfigService,
      MrCopyProtectionService,
    ],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private router: Router,
    private mainState: MainStateService,
    private config: ConfigurationService
  ) {
    // update nav active
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
    ).subscribe((event: any) => {
      const { url } = event;
      this.mainState.updateCustom('currentNav', url);
    });

    // body classes
    this.router.events.pipe(
      filter((event) => event instanceof RoutesRecognized),
      map((event: RoutesRecognized) => event.state.root.firstChild.data)
    ).subscribe((routeData: any) => {
      const { configId } = (routeData || {});
      let bodyClasses = '';
      if (configId) {
        const pageConfig = this.config.get(configId) || {};
        bodyClasses = pageConfig.bodyClasses || '';
      }
      document.body.className = bodyClasses;
    });
  }
}

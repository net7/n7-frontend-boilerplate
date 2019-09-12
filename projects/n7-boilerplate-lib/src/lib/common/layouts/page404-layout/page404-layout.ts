import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Router } from '@angular/router';
import { AbstractLayout } from '../../models/abstract-layout'
// import { ConfigurationService } from '../../services/configuration.service';
import { LayoutsConfigurationService } from '../../services/layouts-configuration.service';
// import { MainStateService } from '../../services/main-state.service';
import { Page404LayoutConfig as config } from './page404-layout.config';

@Component({
    selector: 'n7-page404-layout',
    templateUrl: './page404-layout.html'
})
export class Page404LayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    // private router: Router,
    // private configuration: ConfigurationService,
    layoutsConfiguration: LayoutsConfigurationService,
    // private mainState: MainStateService,
  ){
    super(layoutsConfiguration.get('Page404LayoutConfig') || config);
  }

  protected initPayload(){
    return {
      // configuration: this.configuration,
      // mainState: this.mainState,
      // router: this.router,
      options: this.config.options || {},
    }
  }

  ngOnInit(){
    this.onInit();
  }

  ngOnDestroy(){
    this.onDestroy();
  }
}

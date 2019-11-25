import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../models/abstract-layout'
import { LayoutsConfigurationService } from '../../services/layouts-configuration.service';
import { Page404LayoutConfig as config } from './page404-layout.config';

@Component({
    selector: 'n7-page404-layout',
    templateUrl: './page404-layout.html'
})
export class Page404LayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
  ){
    super(layoutsConfiguration.get('Page404LayoutConfig') || config);
  }

  protected initPayload(){
    return {
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

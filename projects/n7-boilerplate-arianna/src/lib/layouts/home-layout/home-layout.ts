import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import tippy from 'tippy.js';
import {
  AbstractLayout,
  ConfigurationService,
  LayoutsConfigurationService,
  MainStateService,
  CommunicationService
} from '@net7/boilerplate-common';
import { AwHomeLayoutConfig as config } from './home-layout.config';

@Component({
  selector: 'aw-home-layout',
  templateUrl: './home-layout.html',
})
export class AwHomeLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private router: Router,
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
  ) {
    super(layoutsConfiguration.get('AwHomeLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      configuration: this.configuration,
      mainState: this.mainState,
      router: this.router,
      communication: this.communication,
      options: this.config.options || {},
      tippy,
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

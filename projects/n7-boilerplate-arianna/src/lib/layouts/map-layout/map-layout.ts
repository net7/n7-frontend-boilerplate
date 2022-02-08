import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  AbstractLayout,
  ConfigurationService,
  LayoutsConfigurationService,
  MainStateService,
  CommunicationService,
} from '@net7/boilerplate-common';
import { AwMapLayoutConfig as config } from './map-layout.config';

@Component({
  selector: 'aw-map-layout',
  templateUrl: './map-layout.html',
})
export class AwMapLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private configuration: ConfigurationService,
    private layoutsConfiguration: LayoutsConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
    private titleService: Title,
  ) {
    super(layoutsConfiguration.get('AwMapLayoutConfig') || config);
  }

  /*
    Optional variables that can be accessed from the layout's logic.
    If removed, they must also be removed from the layout's DataSource file,
    and from this file imports.
   */
  protected initPayload() {
    return {
      configuration: this.configuration,
      mainState: this.mainState,
      titleService: this.titleService,
      communication: this.communication,
      options: this.config.options || {},
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

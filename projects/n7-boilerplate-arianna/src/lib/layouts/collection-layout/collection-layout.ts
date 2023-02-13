import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigurationService,
  AbstractLayout,
  CommunicationService,
  LayoutsConfigurationService,
  MainStateService
} from '@net7/boilerplate-common';
import { AwCollectionLayoutConfig as config } from './collection-layout.config';

@Component({
  selector: 'n7-collection-layout',
  templateUrl: './collection-layout.html'
})
export class AwCollectionLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private communication: CommunicationService,
    private layoutsConfiguration: LayoutsConfigurationService,
    private configuration: ConfigurationService,
    private route: ActivatedRoute,
    private mainState: MainStateService,
  ) {
    super(config);
  }

  protected initPayload() {
    return {
      communication: this.communication,
      layoutsConfiguration: this.layoutsConfiguration,
      configuration: this.configuration,
      route: this.route,
      mainState: this.mainState,
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

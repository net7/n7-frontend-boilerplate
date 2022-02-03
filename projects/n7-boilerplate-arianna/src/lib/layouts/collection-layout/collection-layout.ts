import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigurationService,
  AbstractLayout,
  CommunicationService,
  LayoutsConfigurationService
} from '@n7-frontend/boilerplate-common';
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
  ) {
    super(config);
  }

  protected initPayload() {
    return {
      communication: this.communication,
      layoutsConfiguration: this.layoutsConfiguration,
      configuration: this.configuration,
      route: this.route
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

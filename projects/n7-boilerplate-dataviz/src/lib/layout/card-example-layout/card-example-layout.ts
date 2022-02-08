import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractLayout,
  CommunicationService,
  LayoutsConfigurationService,
  ConfigurationService
} from '@net7/boilerplate-common';
import { DvCardExampleLayoutConfig as config } from './card-example-layout.config';
import { CardLoader } from '../../models/card-loader';

@Component({
  selector: 'dv-card-example-layout',
  templateUrl: './card-example-layout.html',
})
export class DvCardExampleLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private configId: string;

  private cardLoader: CardLoader;

  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    private activatedRoute: ActivatedRoute,
  ) {
    super(layoutsConfiguration.get('MrResourceLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      configId: this.configId,
      configuration: this.configuration,
      communication: this.communication,
      cardLoader: this.cardLoader,
      options: this.config.options || {},
    };
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.configId = data.configId;
      const pageConfig = this.configuration.get(this.configId);
      this.cardLoader = new CardLoader(this, pageConfig);
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { AwCollectionLayoutConfig as config } from './collection-layout.config';
import { CommunicationService } from '../../../common/services/communication.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';

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

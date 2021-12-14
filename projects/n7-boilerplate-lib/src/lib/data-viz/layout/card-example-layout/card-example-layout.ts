import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { CommunicationService } from '../../../common/services/communication.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { DvCardExampleLayoutConfig as config } from './card-example-layout.config';
import {
  TextItemDS,
} from '../../data-sources';
import { CardEH } from '../../event-handlers';

const DATASOURCE_MAP = {
  text: TextItemDS,
};

@Component({
  selector: 'dv-card-example-layout',
  templateUrl: './card-example-layout.html',
})
export class DvCardExampleLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private configId: string;

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
      options: this.config.options || {},
    };
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.configId = data.configId;
      this.loadWidgets();
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  loadWidgets() {
    const { cards } = this.configuration.get(this.configId);
    this.widgets = [];
    if (cards) {
      cards.forEach(({ sections }) => {
        sections.forEach(({ items }) => {
          items.forEach(({
            id, type, options
          }) => {
            this.widgets.push({
              id,
              options,
              dataSource: DATASOURCE_MAP[type],
              eventHandler: CardEH
            });
          });
        });
      });
    }
  }
}

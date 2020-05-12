import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { CommunicationService } from '../../../common/services/communication.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MrResourceLayoutConfig as config } from './resource-layout.config';
import { MrSliderDS } from '../../data-sources/slider.ds';
import { MrCollectionDS } from '../../data-sources/collection.ds';
import { MrHeroDS } from '../../data-sources/hero.ds';
import { MrSliderEH } from '../../event-handlers/slider.eh';
import { MrCollectionEH } from '../../event-handlers/collection.eh';
import { MrHeroEH } from '../../event-handlers/hero.eh';

const DATASOURCE_MAP = {
  slider: MrSliderDS,
  collection: MrCollectionDS,
  hero: MrHeroDS,
};

const EVENTHANDLER_MAP = {
  slider: MrSliderEH,
  collection: MrCollectionEH,
  hero: MrHeroEH,
};

@Component({
  selector: 'mr-resource-layout',
  templateUrl: './resource-layout.html',
})
export class MrResourceLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private configId: string;

  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private activatedRoute: ActivatedRoute,
    private configuration: ConfigurationService,
    private communication: CommunicationService
  ) {
    super(layoutsConfiguration.get('MrResourceLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      configId: this.configId,
      configuration: this.configuration,
      communication: this.communication,
      options: this.config.options || {}
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
    const resourceConfig = this.configuration.get(this.configId) || {};
    const { sections } = resourceConfig;

    this.widgets = [];
    if (sections) {
      sections.forEach(({ id, type }) => {
        this.widgets.push({
          id,
          dataSource: DATASOURCE_MAP[type],
          eventHandler: EVENTHANDLER_MAP[type]
        });
      });
    }
  }
}

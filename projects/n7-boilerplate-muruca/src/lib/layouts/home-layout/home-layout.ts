import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import {
  AbstractLayout,
  CommunicationService,
  LayoutsConfigurationService,
  ConfigurationService,
  MainStateService
} from '@net7/boilerplate-common';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrHomeLayoutConfig as config } from './home-layout.config';
import { MrSliderDS } from '../../data-sources/slider.ds';
import { MrCollectionDS } from '../../data-sources/collection.ds';
import { MrHeroDS } from '../../data-sources/hero.ds';
import { MrSliderEH } from '../../event-handlers/slider.eh';
import { MrCollectionEH } from '../../event-handlers/collection.eh';
import { MrHeroEH } from '../../event-handlers/hero.eh';
import { MrContentDS } from '../../data-sources/content.ds';

const DATASOURCE_MAP = {
  slider: MrSliderDS,
  collection: MrCollectionDS,
  hero: MrHeroDS,
  content: MrContentDS,
};

const EVENTHANDLER_MAP = {
  slider: MrSliderEH,
  collection: MrCollectionEH,
  hero: MrHeroEH,
};

@Component({
  selector: 'mr-home-layout',
  templateUrl: './home-layout.html',
})
export class MrHomeLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private routeData: Data;

  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private activatedRoute: ActivatedRoute,
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
    public layoutState: MrLayoutStateService,
  ) {
    super(layoutsConfiguration.get('MrHomeLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      routeData: this.routeData,
      mainState: this.mainState,
      configuration: this.configuration,
      communication: this.communication,
      layoutState: this.layoutState,
      options: this.config.options || {}
    };
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((routeData) => {
      this.routeData = routeData;
      this.layoutState.add('content');
      this.loadWidgets();
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  loadWidgets() {
    const { configId } = this.routeData;
    const homeConfig = this.configuration.get(configId) || {};
    const { sections } = homeConfig;

    this.widgets = [];
    if (sections) {
      sections.forEach(({ id, type, options }) => {
        this.widgets.push({
          id,
          options,
          dataSource: DATASOURCE_MAP[type],
          eventHandler: EVENTHANDLER_MAP[type]
        });
      });
    }
  }
}

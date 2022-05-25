import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import {
  AbstractLayout,
  CommunicationService,
  LayoutsConfigurationService,
  ConfigurationService,
  MainStateService,
} from '@net7/boilerplate-common';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrResourceModalService } from '../../services/resource-modal.service';
import { MrItineraryLayoutConfig as config } from './itinerary-layout.config';
import {
  MrCollectionDS,
  MrGalleryDS,
  MrMetadataDS,
} from '../../data-sources';
import {
  MrCollectionEH,
  MrGalleryEH
} from '../../event-handlers';
import { MrLocaleService } from '../../services/locale.service';

const DATASOURCE_MAP = {
  collection: MrCollectionDS,
  metadata: MrMetadataDS,
  gallery: MrGalleryDS,
};

const EVENTHANDLER_MAP = {
  collection: MrCollectionEH,
  gallery: MrGalleryEH,
};

@Component({
  selector: 'mr-itinerary-layout',
  templateUrl: './itinerary-layout.html',
})
export class MrItineraryLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private routeData: Data;

  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private activatedRoute: ActivatedRoute,
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
    private route: ActivatedRoute,
    private router: Router,
    public layoutState: MrLayoutStateService,
    public modalService: MrResourceModalService,
    public localeService: MrLocaleService,
  ) {
    super(layoutsConfiguration.get('MrItineraryLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      routeData: this.routeData,
      configuration: this.configuration,
      communication: this.communication,
      mainState: this.mainState,
      layoutState: this.layoutState,
      modalService: this.modalService,
      localeService: this.localeService,
      options: this.config.options || {},
      route: this.route,
      router: this.router
    };
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((routeData) => {
      this.layoutState.add('content');
      this.routeData = routeData;
      this.loadWidgets();
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  loadWidgets() {
    const { configId } = this.routeData;
    const { sections } = this.configuration.get(configId);
    if (sections) {
      sections.forEach(({ id, type, options }) => {
        const widgetOptions = options || {};
        widgetOptions.localeService = this.localeService;
        this.widgets.push({
          id,
          options: widgetOptions,
          dataSource: DATASOURCE_MAP[type],
          eventHandler: EVENTHANDLER_MAP[type]
        });
      });
    }
  }
}

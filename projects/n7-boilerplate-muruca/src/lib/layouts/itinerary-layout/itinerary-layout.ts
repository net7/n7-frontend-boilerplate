import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractLayout,
  CommunicationService,
  LayoutsConfigurationService,
  ConfigurationService,
  MainStateService,
} from '@n7-frontend/boilerplate-common';
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
  private configId: string;

  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private activatedRoute: ActivatedRoute,
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
    private route: ActivatedRoute,
    private router: Router,
    public layoutState: MrLayoutStateService,
    public modalService: MrResourceModalService
  ) {
    super(layoutsConfiguration.get('MrItineraryLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      configId: this.configId,
      configuration: this.configuration,
      communication: this.communication,
      mainState: this.mainState,
      layoutState: this.layoutState,
      modalService: this.modalService,
      options: this.config.options || {},
      route: this.route,
      router: this.router
    };
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.layoutState.add('content');
      this.configId = data.configId;
      this.loadWidgets();
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  loadWidgets() {
    const { sections } = this.configuration.get(this.configId);
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

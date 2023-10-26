import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import {
  AbstractLayout,
  CommunicationService,
  LayoutsConfigurationService,
  ConfigurationService,
  MainStateService
} from '@net7/boilerplate-common';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrResourceModalService } from '../../services/resource-modal.service';
import { MrResourceLayoutConfig as config } from './resource-layout.config';
import { MrImageViewerEH } from '../../event-handlers/image-viewer.eh';
import { MrTextViewerEH } from '../../event-handlers/text-viewer.eh';
import { MrImageViewerToolsEH } from '../../event-handlers/image-viewer-tools.eh';
import { MrCollectionEH } from '../../event-handlers/collection.eh';
import { MrImageViewerOverlayDetailsEH } from '../../event-handlers/image-viewer-overlay-details.eh';
import {
  MrBreadcrumbsDS,
  MrCollectionDS,
  MrImageViewerDS,
  MrImageViewerToolsDS,
  MrInfoBoxDS,
  MrInnerTitleDS,
  MrItemPreviewDS,
  MrMetadataDS,
  MrTextViewerDS,
  MrResourceTabsDS,
  MrImageViewerOverlayDetailsDS,
} from '../../data-sources';
import { MrMapDS } from '../../data-sources/map.ds';
import { MrLocaleService } from '../../services/locale.service';

const DATASOURCE_MAP = {
  breadcrumbs: MrBreadcrumbsDS,
  collection: MrCollectionDS,
  info: MrInfoBoxDS,
  metadata: MrMetadataDS,
  preview: MrItemPreviewDS,
  text: MrTextViewerDS,
  title: MrInnerTitleDS,
  viewer: MrImageViewerDS,
  'viewer-tools': MrImageViewerToolsDS,
  'viewer-overlay-details': MrImageViewerOverlayDetailsDS,
  tabs: MrResourceTabsDS,
  'text-viewer': MrTextViewerDS,
  map: MrMapDS
};

const EVENTHANDLER_MAP = {
  viewer: MrImageViewerEH,
  'viewer-tools': MrImageViewerToolsEH,
  'viewer-overlay-details': MrImageViewerOverlayDetailsEH,
  'text-viewer': MrTextViewerEH,
  collection: MrCollectionEH,
  // map: MrMapEH
};

@Component({
  selector: 'mr-resource-layout',
  templateUrl: './resource-layout.html',
})
export class MrResourceLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private routerData: Data;

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
    super(layoutsConfiguration.get('MrResourceLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      routerData: this.routerData,
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
    this.activatedRoute.data.subscribe((routerData) => {
      this.layoutState.add('content');
      this.routerData = routerData;
      this.loadWidgets();
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  loadWidgets() {
    const { configId } = this.routerData;
    const { top, content } = this.configuration.get(configId).sections;
    const sections = top.concat(content);
    this.widgets = [];
    if (sections) {
      sections.forEach(({
        id, type, options, tools
      }) => {
        const widgetOptions = options || {};
        widgetOptions.localeService = this.localeService;
        this.widgets.push({
          id,
          options: widgetOptions,
          dataSource: DATASOURCE_MAP[type],
          eventHandler: EVENTHANDLER_MAP[type]
        });
        // image viewer overlay details
        if (type === 'viewer') {
          this.widgets.push({
            id: `${id}-overlay-details`,
            options: widgetOptions,
            dataSource: DATASOURCE_MAP[`${type}-overlay-details`],
            eventHandler: EVENTHANDLER_MAP[`${type}-overlay-details`]
          });
        }
        // image viewer tools
        if (type === 'viewer' && tools) {
          this.widgets.push({
            id: `${id}-tools`,
            options: widgetOptions,
            dataSource: DATASOURCE_MAP[`${type}-tools`],
            eventHandler: EVENTHANDLER_MAP[`${type}-tools`]
          });
        }
      });
    }
  }
}

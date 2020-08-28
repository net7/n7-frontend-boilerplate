import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { CommunicationService } from '../../../common/services/communication.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrResourceLayoutConfig as config } from './resource-layout.config';
import { MrImageViewerEH } from '../../event-handlers/image-viewer.eh';
import {
  MrBreadcrumbsDS,
  MrCollectionDS,
  MrImageViewerDS,
  MrInfoBoxDS,
  MrInnerTitleDS,
  MrItemPreviewDS,
  MrMetadataDS,
  MrTextViewerDS,
  MrResourceTabsDS,
} from '../../data-sources';

const DATASOURCE_MAP = {
  breadcrumbs: MrBreadcrumbsDS,
  collection: MrCollectionDS,
  info: MrInfoBoxDS,
  metadata: MrMetadataDS,
  preview: MrItemPreviewDS,
  text: MrTextViewerDS,
  title: MrInnerTitleDS,
  viewer: MrImageViewerDS,
  tabs: MrResourceTabsDS
};

const EVENTHANDLER_MAP = {
  viewer: MrImageViewerEH,
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
    private communication: CommunicationService,
    private mainState: MainStateService,
    private route: ActivatedRoute,
    public layoutState: MrLayoutStateService,
  ) {
    super(layoutsConfiguration.get('MrResourceLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      configId: this.configId,
      configuration: this.configuration,
      communication: this.communication,
      mainState: this.mainState,
      layoutState: this.layoutState,
      options: this.config.options || {},
      route: this.route
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
    const { top, content } = this.configuration.get(this.configId).sections;
    const sections = top.concat(content);
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

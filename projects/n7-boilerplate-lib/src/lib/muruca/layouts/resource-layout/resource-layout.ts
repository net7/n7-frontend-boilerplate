import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MrInnerTitleDS } from '../../data-sources/inner-title.ds';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { CommunicationService } from '../../../common/services/communication.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MrResourceLayoutConfig as config } from './resource-layout.config';
import { MrImageViewerDS } from '../../data-sources/image-viewer.ds';
import { MrImageViewerEH } from '../../event-handlers/image-viewer.eh';
import { MrMetadataDS } from '../../data-sources/metadata.ds';
import { MrItemPreviewDS } from '../../data-sources/item-preview.ds';
import { MrCollectionDS } from '../../data-sources/collection.ds';

const DATASOURCE_MAP = {
  viewer: MrImageViewerDS,
  metadata: MrMetadataDS,
  preview: MrItemPreviewDS,
  title: MrInnerTitleDS,
  collection: MrCollectionDS
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MrInnerTitleDS } from '../../data-sources/inner-title.ds';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { CommunicationService } from '../../../common/services/communication.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
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
    const { sections } = this.configuration.get(this.configId);

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

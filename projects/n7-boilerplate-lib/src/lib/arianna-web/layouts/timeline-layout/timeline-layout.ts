import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { AwTimelineLayoutConfig as config } from './timeline-layout.config';
import { CommunicationService } from '../../../common/services/communication.service';

@Component({
  selector: 'aw-timeline-layout',
  templateUrl: './timeline-layout.html',
})
export class AwTimelineLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private configuration: ConfigurationService,
    private layoutsConfiguration: LayoutsConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
    private titleService: Title,
  ) {
    super(layoutsConfiguration.get('AwTimelineLayoutConfig') || config);
  }

  /*
    Optional variables that can be accessed from the layout's logic.
    If removed, they must also be removed from the layout's DataSource file,
    and from this file imports.
   */
  protected initPayload() {
    return {
      configuration: this.configuration,
      mainState: this.mainState,
      titleService: this.titleService,
      communication: this.communication,
      options: this.config.options || {},
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

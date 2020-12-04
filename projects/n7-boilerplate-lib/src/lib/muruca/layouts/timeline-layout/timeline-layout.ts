import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { CommunicationService } from '../../../common/services/communication.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrTimelineLayoutConfig as config } from './timeline-layout.config';

@Component({
  selector: 'mr-timeline-layout',
  templateUrl: './timeline-layout.html',
})
export class MrTimelineLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private configId: string;

  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private route: ActivatedRoute,
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
    public layoutState: MrLayoutStateService,
  ) {
    super(layoutsConfiguration.get('MrTimelineLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      configId: this.configId,
      mainState: this.mainState,
      configuration: this.configuration,
      communication: this.communication,
      layoutState: this.layoutState,
      route: this.route,
      options: this.config.options || {}
    };
  }

  ngOnInit() {
    this.route.data.subscribe(() => {
      this.layoutState.add('content');
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

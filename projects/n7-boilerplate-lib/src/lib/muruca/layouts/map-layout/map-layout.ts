import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { CommunicationService } from '../../../common/services/communication.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrMapLayoutConfig as config } from './map-layout.config';

@Component({
  selector: 'mr-map-layout',
  templateUrl: './map-layout.html',
})
export class MrMapLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private configId: string;

  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
    public layoutState: MrLayoutStateService,
  ) {
    super(layoutsConfiguration.get('MrMapLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      configId: this.configId,
      mainState: this.mainState,
      configuration: this.configuration,
      communication: this.communication,
      layoutState: this.layoutState,
      route: this.route,
      router: this.router,
      location: this.location,
      options: this.config.options || {}
    };
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.configId = data.configId;
      this.layoutState.add('content');
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractLayout,
  CommunicationService,
  ConfigurationService,
  MainStateService,
  LayoutsConfigurationService,
} from '@n7-frontend/boilerplate-common';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrStaticLayoutConfig as config } from './static-layout.config';

@Component({
  selector: 'mr-static-layout',
  templateUrl: './static-layout.html',
})
export class MrStaticLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private communication: CommunicationService,
    private configuration: ConfigurationService,
    private mainState: MainStateService,
    private route: ActivatedRoute,
    private router: Router,
    public layoutState: MrLayoutStateService,
    layoutsConfiguration: LayoutsConfigurationService,
  ) {
    super(layoutsConfiguration.get('MrStaticLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      communication: this.communication,
      configuration: this.configuration,
      mainState: this.mainState,
      layoutState: this.layoutState,
      route: this.route,
      router: this.router,
      options: this.config.options || {}
    };
  }

  ngOnInit() {
    this.layoutState.add('content');
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

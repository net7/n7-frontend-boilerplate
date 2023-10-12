import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import {
  AbstractLayout,
  CommunicationService,
  ConfigurationService,
  MainStateService,
  LayoutsConfigurationService,
} from '@net7/boilerplate-common';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrStaticLayoutConfig as config } from './static-layout.config';

@Component({
  selector: 'mr-static-layout',
  templateUrl: './static-layout.html',
})
export class MrStaticLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private routerData: Data;

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
      routerData: this.routerData,
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
    this.route.data.subscribe((routerData) => {
      this.routerData = routerData;
      // add layout states
      this.layoutState.add('content');
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

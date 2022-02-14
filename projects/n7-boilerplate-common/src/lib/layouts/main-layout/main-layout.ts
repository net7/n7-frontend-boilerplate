import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AbstractLayout } from '../../models/abstract-layout';
import { ConfigurationService } from '../../services/configuration.service';
import { LayoutsConfigurationService } from '../../services/layouts-configuration.service';
import { MainStateService } from '../../services/main-state.service';
import { MainLayoutConfig as config } from './main-layout.config';

@Component({
  selector: 'main-layout',
  templateUrl: './main-layout.html',
})
export class MainLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private configuration: ConfigurationService,
    private layoutsConfiguration: LayoutsConfigurationService,
    private mainState: MainStateService,
    private titleService: Title,
  ) {
    super(layoutsConfiguration.get('MainLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      configuration: this.configuration,
      mainState: this.mainState,
      router: this.router,
      route: this.route,
      titleService: this.titleService,
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

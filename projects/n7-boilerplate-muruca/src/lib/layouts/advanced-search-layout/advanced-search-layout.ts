import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import {
  AbstractLayout,
  LayoutsConfigurationService,
  MainStateService,
  ConfigurationService
} from '@net7/boilerplate-common';
import { MrLocaleService } from '../../services/locale.service';
import { MrAdvancedSearchLayoutConfig as config } from './advanced-search-layout.config';

@Component({
  selector: 'mr-advanced-search-layout',
  templateUrl: './advanced-search-layout.html',
})
export class MrAdvancedSearchLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private routeData: Data;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mainState: MainStateService,
    private configuration: ConfigurationService,
    public localeService: MrLocaleService,
    layoutsConfiguration: LayoutsConfigurationService,
  ) {
    super(layoutsConfiguration.get('MrAdvancedSearchLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      routeData: this.routeData,
      configuration: this.configuration,
      mainState: this.mainState,
      router: this.router,
      activatedRoute: this.activatedRoute,
      localeService: this.localeService,
      options: this.config.options || {},
    };
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((routeData) => {
      this.routeData = routeData;
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

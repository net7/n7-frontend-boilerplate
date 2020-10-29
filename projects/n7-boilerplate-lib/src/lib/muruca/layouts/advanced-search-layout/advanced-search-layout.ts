import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MrAdvancedSearchLayoutConfig as config } from './advanced-search-layout.config';

@Component({
  selector: 'mr-advanced-search-layout',
  templateUrl: './advanced-search-layout.html',
})
export class MrAdvancedSearchLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private configId: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mainState: MainStateService,
    private configuration: ConfigurationService,
    layoutsConfiguration: LayoutsConfigurationService,
  ) {
    super(layoutsConfiguration.get('MrAdvancedSearchLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      configId: this.configId,
      configuration: this.configuration,
      mainState: this.mainState,
      router: this.router,
      activatedRoute: this.activatedRoute,
      options: this.config.options || {},
    };
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.configId = data.configId;
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

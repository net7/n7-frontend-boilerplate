import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MrAdvancedSearchLayoutConfig as config } from './advanced-search-layout.config';

@Component({
  selector: 'mr-advanced-search-layout',
  templateUrl: './advanced-search-layout.html',
})
export class MrAdvancedSearchLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
  ) {
    super(layoutsConfiguration.get('MrAdvancedSearchLayoutConfig') || config);
  }

  protected initPayload() {
    return {};
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

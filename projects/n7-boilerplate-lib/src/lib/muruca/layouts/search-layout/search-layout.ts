import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MrSearchLayoutConfig as config } from './search-layout.config';

@Component({
  selector: 'mr-search-layout',
  templateUrl: './search-layout.html',
})
export class MrSearchLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    layoutsConfiguration: LayoutsConfigurationService
  ) {
    super(layoutsConfiguration.get('MrSearchLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      options: this.config.options || {}
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

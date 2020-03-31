import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MrHomeLayoutConfig as config } from './home-layout.config';

@Component({
  selector: 'mr-home-layout',
  templateUrl: './home-layout.html',
})
export class MrHomeLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    layoutsConfiguration: LayoutsConfigurationService
  ) {
    super(layoutsConfiguration.get('MrHomeLayoutConfig') || config);
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

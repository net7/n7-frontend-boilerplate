import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MrStaticLayoutConfig as config } from './static-layout.config';

@Component({
  selector: 'mr-static-layout',
  templateUrl: './static-layout.html',
})
export class MrStaticLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    layoutsConfiguration: LayoutsConfigurationService
  ) {
    super(layoutsConfiguration.get('MrStaticLayoutConfig') || config);
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

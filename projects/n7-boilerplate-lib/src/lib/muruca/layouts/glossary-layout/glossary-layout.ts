import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MrGlossaryLayoutConfig as config } from './glossary-layout.config';

@Component({
  selector: 'mr-glossary-layout',
  templateUrl: './glossary-layout.html',
})
export class MrGlossaryLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    layoutsConfiguration: LayoutsConfigurationService
  ) {
    super(layoutsConfiguration.get('MrGlossaryLayoutConfig') || config);
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

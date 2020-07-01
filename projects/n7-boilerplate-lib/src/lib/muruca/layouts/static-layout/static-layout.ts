import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { CommunicationService } from '../../../common/services/communication.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
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

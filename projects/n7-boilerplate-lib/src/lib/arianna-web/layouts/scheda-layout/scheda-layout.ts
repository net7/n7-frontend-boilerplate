import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AbstractLayout } from '../../../common/models/abstract-layout'
import { ConfigurationService } from '../../../common/services/configuration.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MainStateService } from '../../../common/services';
import { AwPatrimonioLayoutConfig as config } from './scheda-layout.config';
import { CommunicationService } from '../../../common/services';

@Component({
  selector: 'aw-scheda-layout',
  templateUrl: './scheda-layout.html'
})

export class AwSchedaLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private configuration: ConfigurationService,
    private layoutsConfiguration: LayoutsConfigurationService,
    private mainState: MainStateService,
    private titleService: Title,
    private communication: CommunicationService,

  ) {
    super(layoutsConfiguration.get('AwPatrimonioLayoutConfig') || config);
  }

  /**
   * Optional variables that can be accessed from the layout's logic.
   * If removed, they must also be removed from the layout's DataSource file,
   * and from this file imports.
   */
  protected initPayload() {
    return {
      configuration: this.configuration,
      mainState: this.mainState,
      router: this.router,
      route: this.route,
      titleService: this.titleService,
      communication: this.communication,
      options: this.config.options || {},
    }
  }

  ngOnInit() {
    console.log("init");
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AbstractLayout } from "../../../common/models/abstract-layout";
import { ConfigurationService } from '../../../common/services/configuration.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MainStateService } from '../../../common/services';
import { AwEntitaLayoutConfig as config } from './entita-layout.config';
import { CommunicationService } from '../../../common/services';

@Component({
  selector: 'aw-entita-layout',
  templateUrl: './entita-layout.html'
})
export class AwEntitaLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private configuration: ConfigurationService,
    private layoutsConfiguration: LayoutsConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
    private titleService: Title
  ) {
    super(layoutsConfiguration.get('AwEntitaLayoutConfig') || config);
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
      titleService: this.titleService,
      communication: this.communication,
      options: this.config.options || {},
    }
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}
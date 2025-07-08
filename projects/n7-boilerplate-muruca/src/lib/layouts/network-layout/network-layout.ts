import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractLayout,
  CommunicationService,
  LayoutsConfigurationService,
  ConfigurationService,
  MainStateService
} from '@net7/boilerplate-common';
import { Location } from '@angular/common';
import { MrResourceModalService } from '../../services/resource-modal.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrNetworkLayoutConfig as config } from './network-layout.config';
import { MrLocaleService } from '../../services/locale.service';

@Component({
  selector: 'mr-network-layout',
  templateUrl: './network-layout.html',
  styleUrls: ['../../styles/muruca/layouts/_network.scss']
})
export class MrNetworkLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private configId: string;

  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
    public layoutState: MrLayoutStateService,
    public modalService: MrResourceModalService,
    public localeService: MrLocaleService,
    public location: Location,
  ) {
    super(layoutsConfiguration.get('MrNetworkLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      configId: this.configId,
      mainState: this.mainState,
      configuration: this.configuration,
      communication: this.communication,
      layoutState: this.layoutState,
      modalService: this.modalService,
      route: this.route,
      router: this.router,
      localeService: this.localeService,
      location: this.location,
      options: this.config.options || {}
    };
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.layoutState.add('content');
      this.configId = data.configId;
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

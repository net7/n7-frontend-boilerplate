import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractLayout,
  CommunicationService,
  LayoutsConfigurationService,
  ConfigurationService,
  MainStateService
} from '@net7/boilerplate-common';
import { MrResourceModalService } from '../../services/resource-modal.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrTimelineLayoutConfig as config } from './timeline-layout.config';
import { MrLocaleService } from '../../services/locale.service';

@Component({
  selector: 'mr-timeline-layout',
  templateUrl: './timeline-layout.html',
})
export class MrTimelineLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
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
  ) {
    super(layoutsConfiguration.get('MrTimelineLayoutConfig') || config);
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
      options: this.config.options || {}
    };
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.configId = data.configId;
      this.layoutState.add('content');
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

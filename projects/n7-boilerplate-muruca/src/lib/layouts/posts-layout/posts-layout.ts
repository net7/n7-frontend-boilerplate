import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractLayout,
  LayoutsConfigurationService,
  MainStateService,
  ConfigurationService,
  CommunicationService,
} from '@n7-frontend/boilerplate-common';
import { MrPostsLayoutConfig as config } from './posts-layout.config';
import { MrLayoutStateService } from '../../services/layout-state.service';

@Component({
  selector: 'mr-posts-layout',
  templateUrl: './posts-layout.html',
})
export class MrPostsLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
    private configId: string;

    constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mainState: MainStateService,
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    public layoutState: MrLayoutStateService,
    layoutsConfiguration: LayoutsConfigurationService,
    ) {
      super(layoutsConfiguration.get('MrPostsLayoutConfig') || config);
    }

    protected initPayload() {
      return {
        configId: this.configId,
        configuration: this.configuration,
        communication: this.communication,
        mainState: this.mainState,
        router: this.router,
        activatedRoute: this.activatedRoute,
        layoutState: this.layoutState,
        options: this.config.options || {},
      };
    }

    ngOnInit() {
      this.activatedRoute.data.subscribe((data) => {
        this.configId = data.configId;
        // add layout states
        this.layoutState.add(['results']);
        this.onInit();
      });
    }

    ngOnDestroy() {
      this.onDestroy();
    }
}

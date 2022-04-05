import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractLayout,
  LayoutsConfigurationService,
  MainStateService,
  ConfigurationService,
  CommunicationService
} from '@net7/boilerplate-common';
import { MrResourceModalService } from '../../services/resource-modal.service';
import { MrAdvancedResultsLayoutConfig as config } from './advanced-results-layout.config';
import { MrLayoutStateService } from '../../services/layout-state.service';

@Component({
  selector: 'mr-advanced-results-layout',
  templateUrl: './advanced-results-layout.html',
})
export class MrAdvancedResultsLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
    private configId: string;

    constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mainState: MainStateService,
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    public layoutState: MrLayoutStateService,
    public modalService: MrResourceModalService,
    layoutsConfiguration: LayoutsConfigurationService,
    ) {
      super(layoutsConfiguration.get('MrAdvancedResultsLayoutConfig') || config);
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
        modalService: this.modalService,
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

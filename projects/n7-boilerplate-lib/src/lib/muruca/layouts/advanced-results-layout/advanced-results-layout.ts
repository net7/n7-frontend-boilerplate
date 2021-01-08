import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
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
    public layoutState: MrLayoutStateService,
    layoutsConfiguration: LayoutsConfigurationService,
    ) {
      super(layoutsConfiguration.get('MrAdvancedResultsLayoutConfig') || config);
    }

    protected initPayload() {
      return {
        configId: this.configId,
        configuration: this.configuration,
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

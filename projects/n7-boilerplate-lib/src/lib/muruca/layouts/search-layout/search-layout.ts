import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MrSearchLayoutConfig as config } from './search-layout.config';
import { CommunicationService } from '../../../common/services/communication.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrSearchService } from '../../services/search.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
import searchConfig from './search-config.mock';

@Component({
  selector: 'mr-search-layout',
  templateUrl: './search-layout.html',
})
export class MrSearchLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private configId: string;

  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private communication: CommunicationService,
    private configuration: ConfigurationService,
    private searchService: MrSearchService,
    public layoutState: MrLayoutStateService,
    private mainState: MainStateService,

  ) {
    super(layoutsConfiguration.get('MrSearchLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      configId: this.configId,
      configuration: this.configuration,
      mainState: this.mainState,
      router: this.router,
      activatedRoute: this.activatedRoute,
      communication: this.communication,
      searchService: this.searchService,
      layoutState: this.layoutState,
      options: this.config.options || {},
    };
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.configId = data.configId;
      const { searchId } = this.configuration.get(this.configId);
      this.searchService.init(searchId, searchConfig);
      // add layout states
      this.layoutState.add(['results']);
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

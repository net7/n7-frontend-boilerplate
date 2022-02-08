import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractLayout,
  LayoutsConfigurationService,
  CommunicationService,
  ConfigurationService,
  MainStateService
} from '@net7/boilerplate-common';
import { MrSearchLayoutConfig as config } from './search-layout.config';
import { MrSearchService } from '../../services/search.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrResourceModalService } from '../../services/resource-modal.service';

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
    public modalService: MrResourceModalService

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
      modalService: this.modalService,
      options: this.config.options || {},
    };
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.configId = data.configId;
      const { searchId, searchConfig } = this.configuration.get(this.configId);
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

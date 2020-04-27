import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { AwGalleryLayoutConfig as config } from './gallery-layout.config';
import { SearchService } from '../../../common/services/search.service';

@Component({
  selector: 'aw-gallery-layout',
  templateUrl: './gallery-layout.html'
})
export class AwGalleryLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private configuration: ConfigurationService,
    private titleService: Title,
    private layoutsConfiguration: LayoutsConfigurationService,
    private mainState: MainStateService,
    private communication: CommunicationService,
    private search: SearchService,
    private route: ActivatedRoute
  ) {
    super(config);
  }

  protected initPayload() {
    return {
      configuration: this.configuration,
      mainState: this.mainState,
      router: this.router,
      route: this.route,
      titleService: this.titleService,
      communication: this.communication,
      options: this.config.options || {},
      search: this.search,
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import {
  ConfigurationService,
  LayoutsConfigurationService,
  MainStateService,
  SearchService,
  CommunicationService,
} from '../../../common/services';
import { AwGalleryLayoutConfig as config } from './gallery-layout.config';

@Component({
  selector: 'aw-gallery-layout',
  templateUrl: './gallery-layout.html'
})
export class AwGalleryLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private configuration: ConfigurationService,
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
      communication: this.communication,
      search: this.search,
      route: this.route,
      options: this.config.options || {},
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

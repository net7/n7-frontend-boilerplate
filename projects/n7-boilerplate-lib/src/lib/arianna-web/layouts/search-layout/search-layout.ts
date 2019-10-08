import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout'
import { 
  ConfigurationService,
  LayoutsConfigurationService,
  MainStateService,
  SearchService,
  CommunicationService,
} from '../../../common/services';
import { AwSearchLayoutConfig as config } from './search-layout.config';

@Component({
  selector: 'aw-search-layout',
  templateUrl: './search-layout.html'
})

export class AwSearchLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private configuration: ConfigurationService,
    private layoutsConfiguration: LayoutsConfigurationService,
    private mainState: MainStateService,
    private communication: CommunicationService,
    private search: SearchService,

  ) {
    super(layoutsConfiguration.get('AwSearchLayoutConfig') || config);
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
      communication: this.communication,
      search: this.search,
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
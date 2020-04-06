import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MrSearchLayoutConfig as config } from './search-layout.config';
import { SearchService } from '../../../common/services/search.service';
// import { CommunicationService } from '../../../common/services/communication.service';


@Component({
  selector: 'mr-search-layout',
  templateUrl: './search-layout.html',
})
export class MrSearchLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private search: SearchService,
    // private communication: CommunicationService,
  ) {
    super(layoutsConfiguration.get('MrSearchLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      // configuration: this.configuration,
      // mainState: this.mainState,
      // communication: this.communication,
      search: this.search,
      // route: this.route,
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

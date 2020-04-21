import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MrSearchLayoutConfig as config } from './search-layout.config';
// import { CommunicationService } from '../../../common/services/communication.service';


@Component({
  selector: 'mr-search-layout',
  templateUrl: './search-layout.html',
})
export class MrSearchLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  hostEmit$: Subject<any> = new Subject();

  guestEmit$: Subject<any> = new Subject();

  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    // private communication: CommunicationService,
  ) {
    super(layoutsConfiguration.get('MrSearchLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      // configuration: this.configuration,
      // mainState: this.mainState,
      router: this.router,
      activatedRoute: this.activatedRoute,
      // communication: this.communication,
      hostEmit$: this.hostEmit$,
      guestEmit$: this.guestEmit$,
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

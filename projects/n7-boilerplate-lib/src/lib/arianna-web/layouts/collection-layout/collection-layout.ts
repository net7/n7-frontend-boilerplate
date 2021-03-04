import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Title } from '@angular/platform-browser';
import { AbstractLayout } from '../../../common/models/abstract-layout';
// import { ConfigurationService } from '../../../common/services/configuration.service';
// import { MainStateService } from '../../../common/services/main-state.service';
import { AwCollectionLayoutConfig as config } from './collection-layout.config';
import { CommunicationService } from '../../../common/services/communication.service';

@Component({
  selector: 'n7-collection-layout',
  templateUrl: './collection-layout.html'
})
export class AwCollectionLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private communication: CommunicationService
  ) {
    super(config);
  }

  protected initPayload() {
    return {
      communication: this.communication
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

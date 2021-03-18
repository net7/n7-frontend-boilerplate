import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { AwCollectionLayoutConfig as config } from './collection-layout.config';
import { CommunicationService } from '../../../common/services/communication.service';

@Component({
  selector: 'n7-collection-layout',
  templateUrl: './collection-layout.html'
})
export class AwCollectionLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private communication: CommunicationService,
    private route: ActivatedRoute,
  ) {
    super(config);
  }

  protected initPayload() {
    return {
      communication: this.communication,
      route: this.route
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

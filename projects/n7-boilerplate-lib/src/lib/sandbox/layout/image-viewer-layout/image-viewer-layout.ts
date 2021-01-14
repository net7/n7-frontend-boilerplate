/* eslint-disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { CommunicationService } from '../../../common/services/communication.service';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { SbImageViewerLayoutConfig as config } from './image-viewer-layout.config';

@Component({
  selector: 'sb-image-viewer-layout',
  templateUrl: './image-viewer-layout.html',
})
export class SbImageViewerLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private configuration: ConfigurationService,
    private communication: CommunicationService,
  ) {
    super(config);
  }

  initPayload() {
    return {
      configuration: this.configuration,
      communication: this.communication,
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

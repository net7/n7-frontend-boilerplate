import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from "../../../common/models/abstract-layout";
import { CommunicationService } from '../../../common/services';
import { AwGalleryLayoutConfig as config } from './gallery-layout.config';

@Component({
  selector: 'aw-gallery-layout',
  templateUrl: './gallery-layout.html'
})
export class AwGalleryLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private communication: CommunicationService
  ) {
    super(config);
  }

  protected initPayload() {
    return {
      communication: this.communication
    }
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }

}
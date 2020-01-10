import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from "../../../common/models/abstract-layout";
import {
  ConfigurationService,
  CommunicationService,
  MainStateService,
} from '../../../common/services';
import { AwGalleryLayoutConfig as config } from './gallery-layout.config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'aw-gallery-layout',
  templateUrl: './gallery-layout.html'
})
export class AwGalleryLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
    private route: ActivatedRoute,
  ) {
    super(config);
  }

  protected initPayload() {
    return {
      configuration: this.configuration,
      communication: this.communication,
      mainState: this.mainState,
      route: this.route,
    }
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }

}
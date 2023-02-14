/* eslint-disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout, CommunicationService } from '@net7/boilerplate-common';
import { DvExampleLayoutConfig as config } from './example-layout.config';

@Component({
  selector: 'dv-example-layout',
  templateUrl: './example-layout.html',
})
export class DvExampleLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private communication: CommunicationService
  ) {
    super(config);
  }

  initPayload() {
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

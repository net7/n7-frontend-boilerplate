/* eslint-disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { SbExampleLayoutConfig as config } from './example-layout.config';

@Component({
  selector: 'sb-example-layout',
  templateUrl: './example-layout.html',
})
export class SbExampleLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor() {
    super(config);
  }

  initPayload() {
    return {};
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

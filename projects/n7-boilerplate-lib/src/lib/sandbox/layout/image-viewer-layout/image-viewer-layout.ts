/* eslint-disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { SbImageViewerLayoutConfig as config } from './image-viewer-layout.config';

@Component({
  selector: 'sb-image-viewer-layout',
  templateUrl: './image-viewer-layout.html',
})
export class SbImageViewerLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { AwAboutLayoutConfig as config } from './about-layout.config';

@Component({
  selector: 'aw-about-layout',
  templateUrl: './about-layout.html'
})
export class AwAboutLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
  ){
    super(config);
  }

  ngOnInit(){
    this.onInit();
  }

  ngOnDestroy(){
    this.onDestroy();
  }

}
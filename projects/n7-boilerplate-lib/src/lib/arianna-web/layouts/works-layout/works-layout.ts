import { Component, OnInit, OnDestroy } from '@angular/core';
import config from './works-layout.config';
import { AbstractLayout } from '../../../common/models/abstract-layout';

@Component({
  selector: 'aw-works-layout',
  templateUrl: './works-layout.html'
})
export class AwWorksLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
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
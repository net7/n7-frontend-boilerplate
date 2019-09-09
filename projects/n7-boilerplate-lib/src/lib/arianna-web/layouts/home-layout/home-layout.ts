import { Component, OnInit } from '@angular/core';
import config from './home-layout.config';
import { AbstractLayout } from '../../../common/models/abstract-layout';

@Component({
  selector: 'aw-home-layout',
  templateUrl: './home-layout.html'
})
export class AwHomeLayoutComponent extends AbstractLayout implements OnInit {
  constructor(
  ){
    super(config);
    console.log('aw', this.config);
  }

  ngOnInit(){
    this.onInit();
  }

  ngOnDestroy(){
    this.onDestroy();
  }

}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractLayout } from '../../models/abstract-layout'
import { ConfigurationService } from '../../services/configuration.service';
import { MainStateService } from '../../services/main-state.service';
import config from './main-layout.config';

@Component({
    selector: 'main-layout',
    templateUrl: './main-layout.html'
})
export class MainLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private configuration: ConfigurationService,
    private mainState: MainStateService,
  ){
    super(config);
  }

  protected initPayload(){
    return {
      configuration: this.configuration,
      mainState: this.mainState,
      router: this.router,
    }
  }

  ngOnInit(){
    this.onInit();
  }

  ngOnDestroy(){
    this.onDestroy();
  }
}

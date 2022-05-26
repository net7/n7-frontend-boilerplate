import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  AbstractLayout,
  CommunicationService,
  LayoutsConfigurationService,
  ConfigurationService,
  MainStateService
} from '@net7/boilerplate-common';
import { first } from 'rxjs/operators';
import { MrLayoutStateService } from '../../services/layout-state.service';
import { MrMapLayoutConfig as config } from './map-layout.config';
import { MrLocaleService } from '../../services/locale.service';

@Component({
  selector: 'mr-map-layout',
  templateUrl: './map-layout.html',
})
export class MrMapLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  private routerData: Data;

  constructor(
    layoutsConfiguration: LayoutsConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private configuration: ConfigurationService,
    private communication: CommunicationService,
    private mainState: MainStateService,
    public layoutState: MrLayoutStateService,
    public localeService: MrLocaleService,
  ) {
    super(layoutsConfiguration.get('MrMapLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      routerData: this.routerData,
      mainState: this.mainState,
      configuration: this.configuration,
      communication: this.communication,
      layoutState: this.layoutState,
      route: this.route,
      router: this.router,
      location: this.location,
      localeService: this.localeService,
      options: this.config.options || {}
    };
  }

  ngOnInit() {
    this.route.data.pipe(
      first()
    ).subscribe((routerData) => {
      this.routerData = routerData;
      this.layoutState.add('content');
      this.onInit();
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}

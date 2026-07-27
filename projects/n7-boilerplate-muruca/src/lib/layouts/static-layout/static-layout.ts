import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  AbstractLayout,
  CommunicationService,
  ConfigurationService,
  MainStateService,
  LayoutsConfigurationService,
} from '@net7/boilerplate-common';
import { MrLayoutStateService, LayoutState } from '../../services/layout-state.service';
import { MrStaticLayoutConfig as config } from './static-layout.config';

@Component({
  selector: 'mr-static-layout',
  templateUrl: './static-layout.html',
})
export class MrStaticLayoutComponent extends AbstractLayout implements
  OnInit, AfterViewInit, OnDestroy {
  private routerData: Data;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private communication: CommunicationService,
    private configuration: ConfigurationService,
    private mainState: MainStateService,
    private route: ActivatedRoute,
    private router: Router,
    public layoutState: MrLayoutStateService,
    layoutsConfiguration: LayoutsConfigurationService,
  ) {
    super(layoutsConfiguration.get('MrStaticLayoutConfig') || config);
  }

  protected initPayload() {
    return {
      routerData: this.routerData,
      communication: this.communication,
      configuration: this.configuration,
      mainState: this.mainState,
      layoutState: this.layoutState,
      route: this.route,
      router: this.router,
      options: this.config.options || {}
    };
  }

  ngOnInit() {
    this.route.data.subscribe((routerData) => {
      this.routerData = routerData;
      // add layout states
      this.layoutState.add('content');
      this.onInit();
    });
  }

  ngAfterViewInit() {
    const { configId } = this.routerData;
    const timeout = this.configuration.get(configId)?.pageLoad || 0;

    // If a fragment (#id) is present in the url, scroll to it as soon as
    // the content it points to is actually loaded (not on a fixed delay:
    // the content is fetched asynchronously and its arrival time varies)
    combineLatest([
      this.route.fragment,
      this.layoutState.get$('content'),
    ]).pipe(
      takeUntil(this.destroy$),
      filter(([fragment, state]) => !!fragment && state === LayoutState.SUCCESS),
    ).subscribe(([fragment]) => {
      setTimeout(() => {
        document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
      }, timeout);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.onDestroy();
  }
}

import { Component, OnInit } from '@angular/core';
import { LayoutBuilder } from '@n7-frontend/core';

import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';
import { MainLayoutEH } from './main-layout.eh';
import { MainLayoutDS } from './main-layout.ds';
import { ConfigurationService } from '../../services/configuration.service';
import { MainStateService } from '../../services/main-state.service';

@Component({
    selector: 'main-layout',
    templateUrl: './main-layout.html'
})
export class MainLayoutComponent implements OnInit {
  public lb = new LayoutBuilder('main-layout');
  private widgets = [
    { id: 'header' }
  ];

  constructor(
    private configuration: ConfigurationService,
    private mainState: MainStateService
  ){ }

  ngOnInit(){
    // on ready
    this.lb.ready$.subscribe(() => {
      this.lb.eventHandler.emitInner('init', {
        configuration: this.configuration,
        mainState: this.mainState,
      });
    });

    this.lb.init({
      widgetsConfig: this.widgets,
      widgetsDataSources: DS,
      widgetsEventHandlers: EH,
      dataSource: new MainLayoutDS(),
      eventHandler: new MainLayoutEH(),
    });
  }

  ngOnDestroy(){
    this.lb.eventHandler.emitInner('destroy');
  }
}

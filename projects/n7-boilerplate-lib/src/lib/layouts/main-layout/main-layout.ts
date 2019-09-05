import { Component, OnInit } from '@angular/core';
import { LayoutBuilder } from '@n7-frontend/core';

import * as DS from '@lib/common/data-sources';
import * as EH from '@lib/common/event-handlers';
import { MainLayoutEH } from './main-layout.eh';
import { MainLayoutDS } from './main-layout.ds';

@Component({
    selector: 'main-layout',
    templateUrl: './main-layout.html'
})
export class MainLayoutComponent implements OnInit {
  public lb = new LayoutBuilder('main-layout');
  private widgets = [
    { id: 'header', hasStaticData: true }
  ];

  constructor(){ }

  ngOnInit(){
    // on ready
    this.lb.ready$.subscribe(() => {
      this.lb.eventHandler.emitInner('init', {
        // TODO
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

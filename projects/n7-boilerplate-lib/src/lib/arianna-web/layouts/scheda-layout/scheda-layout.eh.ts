import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';

export class AwPatrimonioLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();
  private configuration: any;
  private route: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-scheda-layout.init':
          this.dataSource.onInit(payload);
          this.configuration = payload.configuration;
          this.route = payload.route;
          this.listenRoute();
          break;

        case 'aw-scheda-layout.destroy':
          this.destroyed$.next();
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {   
      if ( type == 'aw-tree.click'){
        if ( payload ) {
          this.emitGlobal('navigate', {path: [this.configuration.get("paths").schedaBasePath + payload], handler: 'router'});
        }
          /*this.dataSource.loadItem(payload).subscribe((response) => {
            if(response){
              this.emitGlobal('navigate', {path: [this.configuration.get("paths").schedaBasePath + response.item.id], handler: 'router'});
              this.dataSource.loadContent(response);
            }
          })*/
        }
    });     
  }

  private listenRoute() {
    this.route.paramMap.subscribe(params => {
      this.dataSource.loadItem(params.get('id')).subscribe((response) => {
        if(response){
          this.emitGlobal('navigate', {path: [this.configuration.get("paths").schedaBasePath + response.item.id], handler: 'router'});
          this.dataSource.loadContent(response);
        }
      });
    });
  }
}
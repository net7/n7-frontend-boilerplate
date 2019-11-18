import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';

export class AwSchedaLayoutEH extends EventHandler {
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
          let paramId = this.route.snapshot.params.id || "";
          this.listenRoute();
          this.loadNavigation(paramId);
          break;

        case 'aw-scheda-layout.destroy':
          this.destroyed$.next();
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-tree.click':
          if (payload) {
            this.emitGlobal('navigate', { path: [this.configuration.get('paths').schedaBasePath + payload], handler: 'router' });
          }
          break;
        case 'aw-sidebar-header.click': this.dataSource.collapseSidebar();
          break;
        case "aw-bubble-chart.bubble-tooltip-goto-click":
          if (!payload || !payload.entityId) return;
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [`aw/entita/${payload.entityId}/overview`]
          });
          break;

      }
    });
  }

  private listenRoute() {
    this.route.paramMap.subscribe(params => {
      if (params.get('id')) {
        this.dataSource.loadItem(params.get('id')).subscribe((response) => {
          console.log('getNode() res: ', response)
          if (response) {
            this.dataSource.loadContent(response);
            if (response.relatedEntities) {
              this.dataSource.hasBubbles = true;
              let relatedEntities = { source: response, relatedEntities: response.relatedEntities, reset: true };
              if (this.dataSource.bubblesEnabled) {
                this.emitOuter('filterbubbleresponse', relatedEntities);
              }
            }
          }
        });
      } else {
        this.dataSource.loadItem();
      }
    });
  }

  private loadNavigation(selectedItem) {
    this.dataSource.getNavigation('patrimonio').subscribe((response) => {
      if (response) {
        console.log("Apollo responded with tree:", response);
        this.dataSource.updateNavigation(response);
        this.emitOuter('navigationresponse', response);
      }
      if (selectedItem) {
        this.emitOuter('selectItem', selectedItem);
      }
    });
  }
}
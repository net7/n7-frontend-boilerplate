import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import helpers from '../../../common/helpers';

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
          const paramId = this.route.snapshot.params.id || '';
          if (paramId) {
            this.dataSource.currentId = paramId;
          }
          this.listenRoute();
          this.loadNavigation(paramId);
          break;

        case 'aw-scheda-layout.destroy':
          this.destroyed$.next();
          this.dataSource.onDestroy();
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-tree.click':
          if (payload) {
            this.emitGlobal('navigate', {
              path: [
                this.configuration.get('paths').schedaBasePath,
                payload.id,
                helpers.slugify(payload.label)
              ],
              handler: 'router'
            });
          }
          break;
        case 'aw-sidebar-header.click': this.dataSource.collapseSidebar();
          break;
        case 'aw-bubble-chart.bubble-tooltip-goto-click':
          const { id, label } = payload;
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [
              this.configuration.get('paths').entitaBasePath,
              id,
              helpers.slugify(label),
              'overview'
            ]
          });
          break;
        case 'aw-linked-objects.click':
          const paths = this.configuration.get('paths');
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [paths.schedaBasePath, payload.id, helpers.slugify(payload.title)]
          });
          break;
        default:
          break;
      }
    });
  }

  private listenRoute() {
    this.route.paramMap.subscribe(params => {
      const paramId = params.get('id');
      if (paramId) {
        if (paramId) {
          this.dataSource.currentId = paramId;
          this.emitOuter('routechanged', paramId);
        }
        this.dataSource.contentIsLoading = true;
        this.dataSource.loadItem(paramId).subscribe((response) => {
          this.dataSource.contentIsLoading = false;
          if (response) {
            this.dataSource.loadContent(response);
            if (Array.isArray(response.relatedEntities) && response.relatedEntities.length) {
              this.dataSource.hasBubbles = true;
              if (this.dataSource.bubblesEnabled) {
                this.emitOuter('filterbubbleresponse', response.relatedEntities);
              }
            }
          }
        });
      }
    });
  }

  private loadNavigation(selectedItem) {
    this.dataSource.updateNavigation('Loading...');
    this.dataSource.getNavigation('patrimonio').subscribe((response) => {
      if (response) {
        this.dataSource.setTree(response);
        this.dataSource.updateNavigation(this.dataSource.getTree().label);
        this.emitOuter('navigationresponse', {
          tree: this.dataSource.getTree(),
          currentItem: selectedItem,
          basePath: this.configuration.get('paths').schedaBasePath
        });
      }
    });
  }
}
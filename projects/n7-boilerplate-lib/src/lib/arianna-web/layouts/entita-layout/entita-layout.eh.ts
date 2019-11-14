import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';

export class AwEntitaLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();
  private configuration: any;
  private route: any;
  private entityId: string;
  // private selectedTab: string;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-entita-layout.init':
          this.dataSource.onInit(payload);
          this.configuration = payload.configuration;
          this.route = payload.route;
          this.entityId = this.route.snapshot.params.id || "";
          this.dataSource.currentPage = this.route.snapshot.params.page || 1;
          this.listenRoute(this.entityId);
          //this.loadNavigation(this.entityId);
          break;

        case 'aw-entita-layout.destroy':
          this.destroyed$.next();
          break;

        case 'aw-entita-layout.showmore':
          if (payload) {
            this.dataSource.handleNavUpdate(payload)
            this.emitGlobal('navigate', {
              path: [
                this.configuration.get("paths").entitaBasePath
                + '/' +
                this.entityId
                + '/' +
                payload
              ],
              handler: 'router'
            });
          }
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-entita-nav.click':
          if (payload) {
            this.dataSource.selectedTab = payload;
            this.dataSource.handleNavUpdate(payload)
          }
          break;
          case 'aw-linked-objects.pagination':
            this.dataSource.currentPage = payload.split('-')[1];
            this.dataSource.handlePageNavigation()
          /*this.emitGlobal('navigate', {
            handler: 'router',
            path: [`aw/entita/${this.route.snapshot.params.id}/oggetti-collegati/${payload.split('-')[1]}`]
          });*/
          break
        case 'aw-linked-objects.goto':
          this.dataSource.currentPage = Number(payload.replace('goto-', ''))
          this.dataSource.handlePageNavigation()
          // this.emitGlobal('navigate', {
          //   handler: 'router',
          //   path: [`aw/entita/${this.route.snapshot.params.id}/oggetti-collegati/${targetPage}`]
          // });
          break
        case 'aw-linked-objects.change':
          this.dataSource.pageSize = payload;
          this.listenRoute("", true) // reloads the page content with the new page size
        case "aw-bubble-chart.bubble-tooltip-goto-click":
          if (!payload || !payload.entityId) return;
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [`aw/entita/${payload.entityId}`]
          });
          break;
          case 'aw-bubble-chart.bubble-filtered':
            if (this.dataSource.selectedTab == "overview" || this.dataSource.selectedTab == "entita-collegate") {
              payload.reload = true;
              payload.reset = true;
              this.emitOuter('filterbubbleresponse', payload);
              //this.dataSource.updateBubbes(payload);
            }
          break
        default:
          break;
      }
    })

  }

  /**
   * Listens to routing events of this layout.
   */
  private listenRoute(selectedItem = "", forceReload = false) {
    // get URL parameters with angular's paramMap
    this.route.paramMap.subscribe(params => {
      // look for id
      if (params.get('id')) {
        if (this.dataSource.currentId == params.get('id') && !forceReload) return;
        // get item from response with id === id and return as promise
        this.dataSource.loadItem(params.get('id'), params.get('tab')).subscribe(res => {
          if (res) {
            this.dataSource.loadContent(res);
            this.dataSource.bubbleLoaded = false;
            let connectedEntities = {
              source: res,
              reload: false
            };

            this.emitOuter('filterbubbleresponse', connectedEntities);

            this.dataSource.updateWidgets(res);
            if (selectedItem) {
              this.emitOuter('selectItem', selectedItem);
            }
          }
        });
      } else {
        this.dataSource.loadItem();
      }
    });
  }
}
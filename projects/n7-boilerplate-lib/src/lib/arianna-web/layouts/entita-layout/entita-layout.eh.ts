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
          console.log(payload)
          this.dataSource.currentPage = +payload.split('-')[1];
          this.dataSource.handlePageNavigation()
          break
        case 'aw-linked-objects.goto':
          console.log(payload)
          this.dataSource.currentPage = +payload.replace('goto-', '')
          this.dataSource.handlePageNavigation()
          break
        case 'aw-linked-objects.change': // changed page size value (pagination)
          this.dataSource.pageSize = payload;
          this.dataSource.currentPage = 1 // reset page
          let options = {
            context: this.dataSource.selectedTab,
            config: this.dataSource.configuration,
            page: this.dataSource.currentPage,
            pagination: true,
            size: this.dataSource.pageSize,
          }
          this.dataSource.updateComponent(
            'aw-linked-objects',
            { items: this.dataSource.myResponse.relatedItems },
            options
          )
          break;
        case "aw-bubble-chart.bubble-tooltip-goto-click":
          if (!payload || !payload.entityId) return;
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [`aw/entita/${payload.entityId}`]
          });
          break;
        case 'aw-bubble-chart.bubble-filtered':
          if (this.dataSource.selectedTab == "overview" || this.dataSource.selectedTab == "entita-collegate") {
            this.emitOuter('filterbubbleresponse', payload.relatedEntities);
          }
          break;
        case 'aw-linked-objects.click':
          const paths = this.configuration.get('paths');
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [payload.type == undefined ? paths.schedaBasePath : paths.entitaBasePath, payload.id]
          });
          break;
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
            // remove the entity of this page
            const entities = res.relatedEntities.filter(entity => entity.id !== params.get('id'))
            this.dataSource.updateWidgets(res);
            if (selectedItem) {
              this.emitOuter('selectItem', selectedItem);
            }
            this.emitOuter('filterbubbleresponse', entities);
          }
        });
      } else {
        this.dataSource.loadItem();
      }
    });
  }
}
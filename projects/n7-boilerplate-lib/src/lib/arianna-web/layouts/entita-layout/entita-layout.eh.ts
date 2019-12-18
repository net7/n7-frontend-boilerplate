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
            // this.dataSource.updateComponent(
            //   'aw-entita-metadata-viewer',
            //   this.dataSource.myResponse.fields,
            //   { 
            //     context: this.dataSource.selectedTab,
            //     config: this.dataSource.configuration,
            //     labels: this.dataSource.configuration.get("labels")
            //   }
            // )
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
        // this.listenRoute("", true) // reloads the page content with the new page size
        case "aw-bubble-chart.bubble-tooltip-goto-click":
          if (!payload || !payload.entityId) return;
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [`aw/entita/${payload.entityId}`]
          });
          break;
        case 'aw-bubble-chart.bubble-filtered':
          if (this.dataSource.selectedTab == "overview" || this.dataSource.selectedTab == "entita-collegate") {
            console.log('filter bubble response', { payload })
            this.emitOuter('filterbubbleresponse', payload.relatedEntities);
            //this.dataSource.updateBubbes(payload);
          }
          break;
        case 'aw-linked-objects.click':
          const paths = this.configuration.get('paths');
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [paths.schedaBasePath, payload]
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
            let entities = res.relatedEntities.filter(entity => entity.id !== params.get('id'))
            this.emitOuter('filterbubbleresponse', entities);

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
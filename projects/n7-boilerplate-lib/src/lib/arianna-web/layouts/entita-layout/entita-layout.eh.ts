import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import helpers from '../../../common/helpers';
import { map } from 'rxjs/operators';

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
            this.dataSource.handleNavUpdate(payload);
          }
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-bubble-chart.d3end': // bounce the event, from bubble-chart to chart-tippy
          this.emitOuter('d3end', payload)
          break;
        case 'aw-entita-nav.click':
          if (payload) {
            this.dataSource.selectedTab = payload;
            this.dataSource.handleNavUpdate(payload)
          }
          break;
        case 'aw-linked-objects.change': // changed page size value (pagination)
          this.dataSource.pageSize = payload;
          this.dataSource.currentPage = 1; // reset page
          const options = {
            context: this.dataSource.selectedTab,
            config: this.dataSource.configuration,
            page: this.dataSource.currentPage,
            pagination: true,
            size: this.dataSource.pageSize,
          };
          this.dataSource.updateComponent(
            'aw-linked-objects',
            { items: this.dataSource.myResponse.relatedItems },
            options
          );
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
        case 'aw-bubble-chart.bubble-filtered':
          if (this.dataSource.selectedTab == "overview" || this.dataSource.selectedTab == "entita-collegate") {
            this.emitOuter('filterbubbleresponse', payload.relatedEntities);
          }
          break;
        default:
          break;
      }
    })

  }

  /**
   * Listens to routing events of this layout.
   */
  private listenRoute(selectedItem = '', forceReload = false) {
    // listen for "page" query param changes
    this.route.queryParams.pipe(
      map((params: any) => params.page)
    ).subscribe(page => {
      if (this.dataSource.currentPage !== page) {
        this.dataSource.currentPage = page;
        this.dataSource.handlePageNavigation();
      }
    });
    // get URL parameters with angular's paramMap
    this.route.paramMap.subscribe(params => {
      // look for id
      if (params.get('id')) {
        if (this.dataSource.currentId === params.get('id') && !forceReload) {
          if (this.dataSource.selectedTab !== params.get('tab')) {
            this.dataSource.handleNavUpdate(params.get('tab'));
          }
          return;
        }
        // get item from response with id === id and return as promise
        this.dataSource.loadItem(params.get('id'), params.get('slug'), params.get('tab')).subscribe(res => {
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
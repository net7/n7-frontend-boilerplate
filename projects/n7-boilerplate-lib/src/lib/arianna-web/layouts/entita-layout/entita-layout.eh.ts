import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export class AwEntitaLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();

  private configuration: any;

  private route: any;

  private entityId: string;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-entita-layout.init':
          this.dataSource.onInit(payload);
          this.configuration = payload.configuration;
          this.route = payload.route;
          this.entityId = this.route.snapshot.params.id || '';
          this.dataSource.currentPage = this.route.snapshot.params.page || 1;
          this.listenRoute(this.entityId);
          // scroll top
          window.scrollTo(0, 0);
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
        case 'aw-entita-nav.click':
          if (payload) {
            this.dataSource.selectedTab = payload;
            this.dataSource.handleNavUpdate(payload);
          }
          break;
        case 'aw-linked-objects.change': { // changed page size value (pagination)
          this.dataSource.pageSize = payload;
          this.dataSource.currentPage = 1; // reset page
          const options = {
            context: this.dataSource.selectedTab,
            config: this.dataSource.configuration,
            dynamicPagination: {
              total: this.dataSource.myResponse.totalCount,
            },
            page: this.dataSource.currentPage,
            size: this.dataSource.pageSize,
            pagination: true,
          };
          this.dataSource.updateComponent(
            'aw-linked-objects',
            { items: this.dataSource.myResponse.relatedItems },
            options,
          );
        } break;
        case 'n7-smart-pagination.change':
          this.handlePageSizeChange(payload.value);
          break;
        default:
          break;
      }
    });
  }

  private handlePageSizeChange = (v) => {
    this.dataSource.pageSize = v;
    this.dataSource.handleNavUpdate('oggetti-collegati');
  }

  /**
   * Listens to routing events of this layout.
   */
  private listenRoute(selectedItem = '', forceReload = false) {
    // listen for "page" query param changes-
    this.route.queryParams.pipe(
      map((params: any) => params.page),
    ).subscribe((page) => {
      if (this.dataSource.currentPage !== page) {
        this.dataSource.currentPage = page;
        this.dataSource.handlePageNavigation();
      }
    });
    // get URL parameters with angular's paramMap
    this.route.paramMap.subscribe((params) => {
      // look for id
      if (params.get('id')) {
        if (this.dataSource.currentId === params.get('id') && !forceReload) {
          if (this.dataSource.selectedTab !== params.get('tab')) {
            this.dataSource.handleNavUpdate(params.get('tab'));
          }
          return;
        }
        // get item from response with id === id and return as promise
        this.dataSource.loadItem(params.get('id'), params.get('slug'), params.get('tab'))
          .subscribe((res) => {
            if (res) {
              this.dataSource.loadContent(res);
              // remove the entity of this page
              this.dataSource.updateWidgets(res);
              if (selectedItem) {
                this.emitOuter('selectItem', selectedItem);
              }
            }
          });
      } else {
        this.dataSource.loadItem();
      }
      // scroll top
      window.scrollTo(0, 0);
    });
  }
}

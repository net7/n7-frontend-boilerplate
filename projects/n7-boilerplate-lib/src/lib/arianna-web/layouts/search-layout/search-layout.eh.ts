import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export class AwSearchLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();
  private route: any;
  private facetsChange$: Subject<any> = new Subject();
  private configuration: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-search-layout.init':
          this.route = payload.route;
          this.configuration = payload.configuration;
          this.dataSource.onInit(payload);
          this._listenToFacetsChange();
          this._listenToRouterChanges();
          break;

        case 'aw-search-layout.destroy':
          this.dataSource.onDestroy();
          this.destroyed$.next();
          break;

        case 'aw-search-layout.orderbychange':
          this.dataSource.onOrderByChange(payload);
          this.facetsChange$.next();
          break;

        case 'aw-search-layout.searchreset':
          this.dataSource.resetButtonEnabled = false;
          this.dataSource.searchModel.clear();
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [this.configuration.get('paths').searchBasePath]
          });
          break;

        default:
          console.warn('(search) unhandled inner event of type', type)
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'facets-wrapper.facetschange':
          this.dataSource.resetPagination();
          break;

        case 'aw-linked-objects.pagination':
          this.dataSource.onPaginationChange(payload).subscribe(changed => {
            if (changed) {
              this.facetsChange$.next();
            }
          });
          break;

        case 'aw-linked-objects.change':
          this.dataSource.onResultsLimitChange(payload);
          this.facetsChange$.next();
          break;

        case 'aw-linked-objects.goto':
          this.dataSource.onPaginationGoToChange(payload).subscribe(changed => {
            if (changed) {
              this.facetsChange$.next();
            }
          });
          break;

        case 'aw-linked-objects.click':
          const paths = this.dataSource.configuration.get('paths');
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [payload.type == undefined ? paths.schedaBasePath : paths.entitaBasePath, payload.id]
          });
          break;
        default:
          break;
      }
    });
  }

  private _listenToFacetsChange() {
    this.facetsChange$.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.dataSource.doSearchRequest$().subscribe(() => {
        this.dataSource.onSearchResponse();
        this.emitGlobal('searchresponse', this.dataSource.getSearchModelId());
      });
    });
  }

  private _listenToRouterChanges() {
    this.route.queryParams.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(params => {
      this.emitOuter('queryparamschange', params);
      this.facetsChange$.next();
    });
  }

}

import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class AwSearchLayoutEH extends EventHandler {
  private route: any;
  private facetsChange$: Subject<any> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-search-layout.init':
          this.dataSource.onInit(payload);
          this.route = payload.route;
          this._listenToFacetsChange();
          this._listenToRouterChanges();
          break;

        case 'aw-search-layout.orderbychange':
          this.dataSource.onOrderByChange(payload);
          this.facetsChange$.next();
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'facets-wrapper.facetschange':
          // this.facetsChange$.next();
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
            path: [paths.entitaBasePath, payload]
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
        this.emitGlobal('searchresponse', this.dataSource.getSearchModelId());
      });
    });
  }

  private _listenToRouterChanges() {
    this.route.queryParams.subscribe(params => {
      this.emitOuter('queryparamschange', params);
      this.facetsChange$.next();
    });
  }

}

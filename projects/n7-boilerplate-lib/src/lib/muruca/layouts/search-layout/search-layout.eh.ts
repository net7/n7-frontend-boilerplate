import { isEmpty } from 'lodash';
import { EventHandler } from '@n7-frontend/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, concatMap, debounceTime } from 'rxjs/operators';
import searchHelper from '../../helpers/search-helper';

export class MrSearchLayoutEH extends EventHandler {
  private destroyed$: Subject<boolean> = new Subject();

  private hostEmit$: Subject<any>;

  private guestEmit$: Subject<any>;

  private facetsReady$: Subject<void> = new Subject();

  private doSearch$: Subject<any> = new Subject();

  private router: Router;

  private activatedRoute: ActivatedRoute;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-layout.init':
          this.hostEmit$ = payload.hostEmit$;
          this.guestEmit$ = payload.guestEmit$;
          this.router = payload.router;
          this.activatedRoute = payload.activatedRoute;
          // listeners
          this.listenToGuest();
          this.listenToRouterChanges();
          // init
          this.dataSource.onInit(payload);

          break;

        case 'mr-search-layout.destroy':
          this.destroyed$.next(true);
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });


    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'n7-smart-pagination.click':
          this.dataSource.setState('page', payload.page);
          this.updateRoute();
          break;

        case 'n7-smart-pagination.change':
          this.dataSource.setState('limit', payload.value);
          this.updateRoute();
          break;

        default:
          break;
      }
    });

    // search request stream
    this.doSearch$.pipe(
      debounceTime(500),
      concatMap((params: any) => this.dataSource.doRequest$(params))
    ).subscribe((response) => {
      this.dataSource.handleResponse(response);
    });
  }

  listenToGuest() {
    this.guestEmit$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(({ type, payload }) => {
      switch (type) {
        case 'facetsready': {
          this.facetsReady$.next();
          break;
        }

        case 'change': {
          this.dataSource.setState(payload.id, payload.value);
          this.updateRoute();
          break;
        }

        default:
          break;
      }
    });
  }

  listenToRouterChanges() {
    this.activatedRoute.queryParams.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((params) => {
      // params state control
      if (isEmpty(params) && !isEmpty(this.dataSource.getState())) {
        this.clearSearchState();
      } else if (isEmpty(this.dataSource.getState()) && !isEmpty(params)) {
        this.setSearchState(params);
      }

      this.doSearch$.next(searchHelper.queryParamsToState(params));
    });
  }

  updateRoute() {
    const queryParams = searchHelper.stateToQueryParams(this.dataSource.getState());
    this.router.navigate([], {
      queryParams
    });
  }

  private clearSearchState() {
    this.dataSource.clearState();
    this.hostEmit$.next({ type: 'clearinputs' });
  }

  private setSearchState(params) {
    this.facetsReady$.subscribe(() => {
      const stateParams = searchHelper.queryParamsToState(params);
      Object.keys(stateParams).forEach((key) => {
        this.dataSource.setState(key, stateParams[key]);
        this.hostEmit$.next({
          type: 'updateinputvalue',
          payload: {
            id: key,
            value: stateParams[key]
          }
        });
      });
    });
  }
}

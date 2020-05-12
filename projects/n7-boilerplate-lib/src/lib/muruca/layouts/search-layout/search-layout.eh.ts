import { isEmpty } from 'lodash';
import { EventHandler } from '@n7-frontend/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import searchHelper from '../../helpers/search-helper';

export class MrSearchLayoutEH extends EventHandler {
  private destroyed$: Subject<boolean> = new Subject();

  private hostEmit$: Subject<any>;

  private guestEmit$: Subject<any>;

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

          this.dataSource.onInit(payload);
          this.listenToGuest();
          this.listenToRouterChanges();


          /* setTimeout(() => {
            this.hostEmit$.next({
              type: 'updateinputdata',
              payload: {
                id: 'input-00',
                data: {
                  placeholder: 'Cerca su tutto',
                }
              }
            });
            this.hostEmit$.next({
              type: 'updateinputvalue',
              payload: {
                id: 'input-00',
                value: 'Sto cercando...'
              }
            });
          }, 5000); */
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
  }

  listenToGuest() {
    this.guestEmit$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(({ type, payload }) => {
      switch (type) {
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
      takeUntil(this.destroyed$),
    ).subscribe((params) => {
      // params state control
      if (isEmpty(params)) {
        this.clearSearchState();
      } else if (isEmpty(this.dataSource.getState())) {
        this.setSearchState(params);
      }
      // TODO: aggiungere logica richieste
      console.warn('query params', params, this.dataSource.getState());
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
  }
}

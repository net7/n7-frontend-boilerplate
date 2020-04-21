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

    /*
      this.outerEvents$.subscribe(({ type, payload }) => {
      });
    */
  }

  listenToGuest() {
    this.guestEmit$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(({ type, payload }) => {
      switch (type) {
        case 'change': {
          const queryParams = searchHelper.stateToQueryParams(payload.state);
          this.router.navigate([], {
            queryParams
          });
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
      // TODO: aggiungere logica richieste
      console.warn('query params', params);
    });
  }
}

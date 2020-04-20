import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class MrSearchLayoutEH extends EventHandler {
  private destroyed$: Subject<boolean> = new Subject();

  private hostEmit$: Subject<any>;

  private guestEmit$: Subject<any>;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-layout.init':
          this.hostEmit$ = payload.hostEmit$;
          this.guestEmit$ = payload.guestEmit$;

          this.dataSource.onInit(payload);
          this.listenToGuest();

          /* setTimeout(() => {
            this.hostEmit$.next({
              type: 'updateinputdata',
              payload: {
                id: 'input-00',
                data: {
                  id: 'input-text-00',
                  placeholder: 'Cerca su tutto',
                  icon: 'n7-icon-search',
                  inputPayload: 'search-input',
                  enterPayload: 'search-enter',
                  iconPayload: 'search-icon'
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
      console.warn(type, payload);
    });
  }
}

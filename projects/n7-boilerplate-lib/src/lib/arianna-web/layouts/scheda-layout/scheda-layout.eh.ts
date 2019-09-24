import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class AwPatrimonioLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-scheda-layout.init':
          this.dataSource.onInit(payload);
          break;

        case 'aw-scheda-layout.destroy':
          this.destroyed$.next();
          break;

        default:
          break;
      }
    });

    /**
     * Global Events Listener
     * 
     * Remove this function if this layout doesn't
     * use routing events. 
     */
    EventHandler.globalEvents$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(({ type, payload }) => {
      switch (type) {
        case 'global.navigate':
          this.dataSource.onNavigate(payload);
          break;

        default:
          break;
      }
    });
  }
}
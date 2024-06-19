import { EventHandler } from '@net7/core';
import { Subject } from 'rxjs';

export class Page404LayoutEH extends EventHandler {
  private destroyed$: Subject<void> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'n7-page404-layout.init':
          this.dataSource.onInit(payload);
          break;

        case 'n7-page404-layout.destroy':
          this.destroyed$.next();
          break;

        default:
          break;
      }
    });

    // listen to global events
    /* EventHandler.globalEvents$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(({type, payload}) => {
      switch(type){
        case 'global.navigate':
          this.dataSource.onNavigate(payload);
          break;

        default:
          break;
      }
    }); */
  }
}

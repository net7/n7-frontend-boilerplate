import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class MainLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch(type) {
        case 'main-layout.init':
          this.dataSource.onInit(payload);
          break;

        case 'main-layout.destroy':
            this.destroyed$.next();
            break;

        default:
            break;
      }
    });

    // listen to global events
    EventHandler.globalEvents$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(({type, payload}) => {
      switch(type){
        case 'global.navigate':
          this.dataSource.onNavigate(payload);
          break;
          
        default: 
          break;
      }
    });
  }
  
}
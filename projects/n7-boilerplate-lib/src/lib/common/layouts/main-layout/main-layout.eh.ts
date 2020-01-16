import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil, first, filter } from 'rxjs/operators';
import { SearchService } from '../../services';

export class MainLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();
  private route: any;
  private mainState: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch(type) {
        case 'main-layout.init':
          this.dataSource.onInit(payload);
          this.mainState = payload.mainState;
          this.route = payload.route;

          this._listenRouterChanges();
          this._listenMainStateChanges();
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

  private _listenRouterChanges(){
    this.route.queryParams.pipe(
      filter(params => {
        if(Object.keys(params).length) return true;
        return false;
      }),
      // first(),
    ).subscribe(params => {
      this.emitGlobal('queryparams', params);

      // to use in searchs
      SearchService.queryParams = params;
    });
  }


  private _listenMainStateChanges(){
    this.mainState.addCustom('currentNav', new Subject());
    this.mainState.getCustom$('currentNav').subscribe(val => {
      this.emitOuter('currentnavchange', val);
    });
  }
}

import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class AwSearchLayoutEH extends EventHandler {
  private facetsChange$: Subject<any> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-search-layout.init':
          this.dataSource.onInit(payload);
          this._listenToFacetsChange();
          break;

        case 'aw-search-layout.orderbychange':
          // TODO: orderby
          console.log('orderby', {type, payload});
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'facets-wrapper.facetschange':
          this.facetsChange$.next();
          break;

        default:
          break;
      }
    });

    // listen to global events
    EventHandler.globalEvents$.subscribe(({ type, payload }) => {
      switch(type){
        case 'global.queryparams':
          this.emitOuter('queryparams', payload);
          break;

        default: 
          break;
      }
    });
  }

  private _listenToFacetsChange(){
    this.facetsChange$.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.dataSource.doSearchRequest$().subscribe(() => {
        this.emitOuter('searchresponse');
      });
    })
  }
}
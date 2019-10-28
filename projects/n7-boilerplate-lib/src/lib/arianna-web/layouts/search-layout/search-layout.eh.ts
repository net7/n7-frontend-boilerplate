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
          this.facetsChange$.next();
          break;

        case 'aw-linked-objects.pagination':
          this.dataSource.onPaginationChange(payload).subscribe(changed => {
            if(changed) this.facetsChange$.next();
          });
          break;

        case 'aw-linked-objects.goto':
            this.dataSource.onPaginationGoToChange(payload).subscribe(changed => {
              if(changed) this.facetsChange$.next();
            });
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
        this.emitGlobal('searchresponse', this.dataSource.getSearchModelId());
      });
    })
  }
}
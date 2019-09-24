import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class AwPatrimonioLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-patrimonio-layout.init':
          this.dataSource.onInit(payload);
          break;

        case 'aw-patrimonio-layout.destroy':
          this.destroyed$.next();
          break;

        default:
          break;
      }
    });
  }
}
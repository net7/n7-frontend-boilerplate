import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { MrInputTagDS } from '../../data-sources/form/input-tag.ds';
import { MrInputEventHandler, MrChangedParams } from '../../interfaces/form.interface';

export class MrInputTagEH extends EventHandler implements MrInputEventHandler {
  public changed$: Subject<MrChangedParams>;

  public dataSource: MrInputTagDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.click`: {
          const { value } = payload;
          // set new value
          this.dataSource.setState({ value });
          // emit changed signal
          this.changed$.next({
            id: this.dataSource.id,
            state: this.dataSource.getState()
          });
          break;
        }
        default:
          break;
      }
    });
  }
}

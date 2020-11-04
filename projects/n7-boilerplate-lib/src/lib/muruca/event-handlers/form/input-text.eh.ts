import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { MrInputTextDS } from '../../data-sources/form/input-text.ds';
import { MrInputEventHandler, MrChangedParams } from '../../interfaces/form.interface';

export class MrInputTextEH extends EventHandler implements MrInputEventHandler {
  public changed$: Subject<MrChangedParams>;

  public dataSource: MrInputTextDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.change`: {
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

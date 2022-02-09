import { EventHandler } from '@net7/core';
import { Subject } from 'rxjs';
import { MrInputCheckboxDS } from '../../data-sources/form/input-checkbox.ds';
import { MrInputEventHandler, MrChangedParams } from '../../interfaces/form.interface';

export class MrInputCheckboxEH extends EventHandler implements MrInputEventHandler {
  public changed$: Subject<MrChangedParams>;

  public dataSource: MrInputCheckboxDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.change`: {
          // update value
          this.dataSource.toggleValue(payload);
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

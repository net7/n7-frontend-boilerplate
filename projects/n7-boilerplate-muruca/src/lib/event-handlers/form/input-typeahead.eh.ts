import { EventHandler } from '@net7/core';
import { Subject } from 'rxjs';
import { MrInputTypeaheadDS } from '../../data-sources/form/input-typeahead.ds';
import { MrInputEventHandler, MrChangedParams } from '../../interfaces/form.interface';

export class MrInputTypeaheadEH extends EventHandler implements MrInputEventHandler {
  public changed$: Subject<MrChangedParams>;

  public dataSource: MrInputTypeaheadDS;

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

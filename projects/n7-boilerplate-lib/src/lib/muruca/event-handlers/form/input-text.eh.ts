import { EventHandler } from '@n7-frontend/core';
import { MrInputTextDS } from '../../data-sources/form/input-text.ds';
import { MrInputEventHandler } from '../../interfaces/form.interface';
import { MrFormService } from '../../services/form.service';

export class MrInputTextEH extends EventHandler implements MrInputEventHandler {
  public form: MrFormService;

  public dataSource: MrInputTextDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.change`: {
          const { value } = payload;
          this.dataSource.setValue(value);
          this.form.changed$.next({
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

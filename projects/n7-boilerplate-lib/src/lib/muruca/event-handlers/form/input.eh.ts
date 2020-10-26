import { filter } from 'rxjs/operators';
import { EventHandler } from '@n7-frontend/core';
import { MrFormService } from '../../services/form.service';

export abstract class MrInputEH extends EventHandler {
  protected form: MrFormService;

  constructor() {
    super();

    // listen form builder events
    this.listenFormEvents();
  }

  protected listenFormEvents() {
    this.form.event$.pipe(
      filter((ev) => ev.id === this.dataSource.id)
    ).subscribe(({ type, state }) => {
      if (type === 'setstate') {
        this.dataSource.setState(state);
      } else if (type === 'clear') {
        this.dataSource.clear();
      } else if (type === 'refresh') {
        this.dataSource.refresh();
      }
    });
  }
}

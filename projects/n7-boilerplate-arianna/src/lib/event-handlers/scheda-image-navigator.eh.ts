import { EventHandler } from '@net7/core';
import { AwSchedaImageNavigatorDS } from '../data-sources';

export class AwSchedaImageNavigatorEH extends EventHandler {
  dataSource: AwSchedaImageNavigatorDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-scheda-image-navigator.change':
          this.dataSource.onChange(payload);
          break;
        case 'aw-scheda-image-navigator.submit':
          this.dataSource.onSubmit();
          break;
        default:
          break;
      }
    });
  }
}

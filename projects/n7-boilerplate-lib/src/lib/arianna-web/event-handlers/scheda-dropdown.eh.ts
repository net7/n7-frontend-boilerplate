import { EventHandler } from '@n7-frontend/core';

export class AwSchedaDropdownEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      if (type === 'aw-scheda-dropdown.click') {
        this.dataSource.onChange(payload);
        this.emitOuter('click', payload);
      }
    });
  }
}

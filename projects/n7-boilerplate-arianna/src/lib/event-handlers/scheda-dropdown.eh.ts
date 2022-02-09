import { EventHandler } from '@net7/core';

export class AwSchedaDropdownEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      if (type === 'aw-scheda-dropdown.click') {
        if (payload === 'toggle') {
          this.dataSource.toggle();
        } else {
          this.dataSource.onChange(payload);
          this.emitOuter('click', payload);
        }
      }
    });
  }
}

import { EventHandler } from '@n7-frontend/core';

export class AwSchedaPdfEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      if (type === 'aw-scheda-pdf.click') {
        this.dataSource.onChange(payload);
      }
    });
  }
}

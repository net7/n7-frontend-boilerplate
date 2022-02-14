import { EventHandler } from '@net7/core';
import { AwSchedaPdfDS } from '../data-sources';

export class AwSchedaPdfEH extends EventHandler {
  public dataSource: AwSchedaPdfDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      if (type === 'aw-scheda-pdf.click') {
        this.dataSource.onChange(payload);
      } else if (type === 'aw-scheda-pdf.loaded') {
        this.dataSource.onLoaded();
      }
    });
  }
}

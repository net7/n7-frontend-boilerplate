import { EventHandler } from '@net7/core';
import { AwSchedaSearchDS } from '../data-sources';

export class AwSchedaSearchEH extends EventHandler {
  dataSource: AwSchedaSearchDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      // redirect event
      this.emitOuter(type.split('.')[1], payload);
    });

    this.outerEvents$.subscribe(({ type }) => {
      if (type === 'aw-scheda-layout.schedasearchrequest') {
        this.dataSource.setLoading(true);
      }
    });
  }
}

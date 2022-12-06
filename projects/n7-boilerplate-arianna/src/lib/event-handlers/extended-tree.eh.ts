import { EventHandler } from '@net7/core';
import { AwExtendedTreeDS } from '../data-sources';

export class AwExtendedTreeEH extends EventHandler {
  dataSource: AwExtendedTreeDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      if (payload === 'search-button') {
        this.dataSource.toggleSearch();
      } else {
        // redirect event
        this.emitOuter(type.split('.')[1], payload);
      }
    });

    this.outerEvents$.subscribe(({ type }) => {
      if (type === 'aw-scheda-layout.routechanged') {
        this.dataSource.searchIsOpen = false;
      }
      if (type === 'aw-scheda-layout.extendedtreerequest') {
        this.dataSource.setLoading(true);
      }
    });
  }
}

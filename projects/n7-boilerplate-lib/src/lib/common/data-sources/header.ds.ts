import { DataSource } from '@n7-frontend/core';
import { IHeaderData } from '@n7-frontend/components';

export class HeaderDS extends DataSource {
  protected transform(data): IHeaderData {
    return data.items;
  }

  public onCurrentNavChange (payload) {
    this.output.nav.items.forEach(item => {
      if (item._meta.id === payload) {
        item.classes = 'is-current';
      } else {
        item.classes = '';
      }
    });
  }
}

import { DataSource } from '@n7-frontend/core';

export class AwPatrimonioSidebarHeaderDS extends DataSource {

  protected transform(data) {
     console.log(data);
    const SIDEBAR_HEADER_DATA = {
       iconLeft: 'n7-icon-tree-icon',
        text: 'Albero di navigazione',
        additionalText: '10.324.592',
        iconRight: 'n7-icon-angle-left',
        classes: 'is-expanded',
        payload: 'header'
    };
    return SIDEBAR_HEADER_DATA;
  }
}
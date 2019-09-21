import { DataSource } from '@n7-frontend/core';

export class AwPatrimonioSidebarHeaderDS extends DataSource {

  protected transform(data) {
    const SIDEBAR_HEADER_DATA = {
       iconLeft: 'n7-icon-tree-icon',
        text: data,
        iconRight: 'n7-icon-angle-left',
        classes: 'is-expanded',
        payload: 'header'
    };
    return SIDEBAR_HEADER_DATA;
  }
}
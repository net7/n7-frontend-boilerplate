import { DataSource } from '@n7-frontend/core';

export class AwSidebarHeaderDS extends DataSource {
  protected transform(data) {
    return {
      iconLeft: 'n7-icon-tree-icon',
      text: data.text || '',
      iconRight: data.isExpanded ? 'n7-icon-angle-left' : 'n7-icon-angle-right',
      classes: data.isExpanded ? 'is-expanded' : 'is-collapsed',
      payload: 'header',
    };
  }

  toggleSidebar() {
    const sidebarData = this.output;
    if (sidebarData.classes === 'is-expanded') {
      sidebarData.classes = 'is-collapsed';
      sidebarData.iconRight = 'n7-icon-angle-right';
    } else {
      sidebarData.classes = 'is-expanded';
      sidebarData.iconRight = 'n7-icon-angle-left';
    }
  }
}

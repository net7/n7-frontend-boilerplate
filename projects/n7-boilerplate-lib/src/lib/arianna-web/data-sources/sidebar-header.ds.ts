import { DataSource } from '@n7-frontend/core';

export class AwSidebarHeaderDS extends DataSource {

  protected transform(data) {
    return data;
  }

  toggleSidebar() {
      let sidebarData = this.output;
      if ( sidebarData.classes == 'is-expanded' ) {
        sidebarData.classes = 'is-collapsed';
        sidebarData.iconRight = 'n7-icon-tree-icon';

      } else {
        sidebarData.classes = 'is-expanded';
        sidebarData.iconRight = 'n7-icon-angle-left';
    }
    this.update(sidebarData);
  }
}
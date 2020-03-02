import { DataSource } from '@n7-frontend/core';

export class AwSchedaBreadcrumbsDS extends DataSource {
  protected transform(data) {
    return data;
  }

  toggleSidebar() {
    const sidebarData = this.output;
    if (sidebarData.classes === 'is-expanded') {
      sidebarData.classes = 'is-collapsed';
    } else {
      sidebarData.classes = 'is-expanded';
    }
    this.update(sidebarData);
  }
}

import { DataSource, _t } from '@n7-frontend/core';

export class MrResourceTabsDS extends DataSource {
  protected transform(data: any): any {
    const {
      currentTab, root, slug, id: resourceId
    } = this.options;

    return data.map(({ id, label }) => ({
      label: _t(label),
      classes: currentTab === id ? 'is-active' : '',
      anchor: {
        href: `/${root}/${resourceId}/${slug}/${id}`
      }
    }));
  }
}

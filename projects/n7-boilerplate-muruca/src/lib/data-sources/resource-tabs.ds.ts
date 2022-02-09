import { DataSource, _t } from '@net7/core';

export class MrResourceTabsDS extends DataSource {
  protected transform(data: any): any {
    if (!data) return null;
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

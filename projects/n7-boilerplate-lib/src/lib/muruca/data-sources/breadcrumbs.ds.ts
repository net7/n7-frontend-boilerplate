import { DataSource, _t } from '@n7-frontend/core';
import { BreadcrumbsData } from '@n7-frontend/components';

export class MrBreadcrumbsDS extends DataSource {
  protected transform(data: any): BreadcrumbsData {
    if (!data) return null;
    let items = [];
    if (Array.isArray(data) && data.length) {
      let { base } = this.options || {};
      base = Array.isArray(base) ? base : [];
      items = [
        ...base.map(({ link, title }) => ({
          label: _t(title),
          anchor: { href: link }
        })),
        ...data.map(({ link, title }) => ({
          label: title,
          anchor: { href: link }
        }))
      ];
    }

    // remove last link
    if (items.length) {
      items[items.length - 1].anchor = null;
    }
    return { items };
  }
}

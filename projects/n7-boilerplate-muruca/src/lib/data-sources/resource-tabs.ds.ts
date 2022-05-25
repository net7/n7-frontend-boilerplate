import { DataSource, _t } from '@net7/core';
import { MrLocaleService } from '../services/locale.service';

export class MrResourceTabsDS extends DataSource {
  protected transform(data: any): any {
    if (!data) return null;
    const {
      currentTab, root, slug, id: resourceId
    } = this.options;

    const { localeService }: { localeService: MrLocaleService } = this.options;
    let baseUrl = root;
    if (typeof root !== 'string') {
      const locale = localeService.getLocale();
      baseUrl = root[locale];
    }

    return data.map(({ id, label }) => ({
      label: _t(label),
      classes: currentTab === id ? 'is-active' : '',
      anchor: {
        href: `/${baseUrl}/${resourceId}/${slug}/${id}`
      }
    }));
  }
}

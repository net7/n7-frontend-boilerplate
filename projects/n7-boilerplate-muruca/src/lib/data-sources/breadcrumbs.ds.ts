import { DataSource, _t } from '@net7/core';
import { BreadcrumbsData } from '@net7/components';
import { MrLocaleService } from '../services/locale.service';
import linksHelper from '../helpers/links-helper';

export class MrBreadcrumbsDS extends DataSource {
  protected transform(data: any): BreadcrumbsData {
    if (!data) return null;
    let items = [];
    if (Array.isArray(data) && data.length) {
      let { base } = this.options || {};
      base = Array.isArray(base) ? base : [];
      items = [
        ...base.map((item) => ({
          label: _t(item.title),
          anchor: this.getAnchor(item),
        })),
        ...data.map((item) => ({
          label: item.title,
          anchor: this.getAnchor(item),
        }))
      ];
    }

    // remove last link
    if (items.length) {
      items[items.length - 1].anchor = null;
    }
    return { items };
  }

  private getAnchor({
    link, routeId, slug, id
  }) {
    const { localeService }: { localeService: MrLocaleService } = this.options;
    // link
    let anchor;
    if (routeId) {
      const routeLink = localeService.getLinkByRouteId(routeId, id, slug);
      anchor = {
        href: routeLink
      };
    } else if (link) {
      anchor = {
        href: linksHelper.getRouterLink(link)
      };
    }
    return anchor;
  }
}

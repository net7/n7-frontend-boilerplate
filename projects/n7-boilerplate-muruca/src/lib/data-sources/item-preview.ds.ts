import { ItemPreviewData } from '@net7/components';
import { DataSource } from '@net7/core';
import { merge } from 'lodash';
import { helpers } from '@net7/boilerplate-common';
import linksHelper from '../helpers/links-helper';
import { MrLocaleService } from '../services/locale.service';

const ITEM_PREVIEW_DEFAULTS = {
  limit: 100,
  striptags: true
};

export class MrItemPreviewDS extends DataSource {
  id: string;

  protected transform(data: any): ItemPreviewData {
    if (!data) return null;
    const { classes, itemPreview } = this.options;
    const { localeService }: { localeService: MrLocaleService } = this.options;
    const itemPreviewOptions = merge(ITEM_PREVIEW_DEFAULTS, (itemPreview || {}));

    // striptags
    if (itemPreviewOptions.striptags) {
      data.text = helpers.striptags(data.text);
    }
    // limit
    if (itemPreviewOptions.limit && (data.text.length > itemPreviewOptions.limit)) {
      data.text = `${data.text.substring(0, itemPreviewOptions.limit)}...`;
    }

    // link
    let anchor;
    if (data.routeId) {
      const routeLink = localeService.getLinkByRouteId(data.routeId, data.id, data.slug);
      anchor = {
        href: routeLink,
        queryParams: data.params || null,
      };
    } else if (data.link) {
      anchor = {
        href: linksHelper.getRouterLink(data.link),
        queryParams: linksHelper.getQueryParams(data.link),
      };
    }
    return {
      ...data,
      anchor,
      classes: classes || ''
    };
  }
}

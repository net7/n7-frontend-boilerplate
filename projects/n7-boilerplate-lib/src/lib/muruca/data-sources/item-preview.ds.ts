import { ItemPreviewData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';
import { merge } from 'lodash';
import helpers from '../../common/helpers';
import linksHelper from '../helpers/links-helper';

const ITEM_PREVIEW_DEFAULTS = {
  limit: 100,
  striptags: true
};

export class MrItemPreviewDS extends DataSource {
  id: string;

  protected transform(data: any): ItemPreviewData {
    const { classes, itemPreview } = this.options;
    const itemPreviewOptions = merge(ITEM_PREVIEW_DEFAULTS, (itemPreview || {}));

    // striptags
    if (itemPreviewOptions.striptags) {
      data.text = helpers.striptags(data.text);
    }
    // limit
    if (itemPreviewOptions.limit && (data.text.length > itemPreviewOptions.limit)) {
      data.text = `${data.text.substring(0, itemPreviewOptions.limit)}...`;
    }
    return {
      ...data,
      anchor: {
        href: linksHelper.getRouterLink(data.link),
        queryParams: linksHelper.getQueryParams(data.link)
      },
      classes: classes || ''
    };
  }
}

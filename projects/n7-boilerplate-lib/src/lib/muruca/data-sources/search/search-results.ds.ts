import { DataSource, _t } from '@n7-frontend/core';
import { merge } from 'lodash';
import helpers from '../../../common/helpers';
import linksHelper from '../../helpers/links-helper';

const ITEM_PREVIEW_DEFAULTS = {
  limit: 100,
  striptags: true
};

export class MrSearchResultsDS extends DataSource {
  protected transform(data) {
    const { results } = data;
    const { itemPreview } = this.options.config;
    const itemPreviewOptions = merge(ITEM_PREVIEW_DEFAULTS, (itemPreview || {}));

    return results.map((item) => {
      // striptags
      if (itemPreviewOptions.striptags) {
        item.text = helpers.striptags(item.text);
      }
      // limit
      if (itemPreviewOptions.limit && (item.text.length > itemPreviewOptions.limit)) {
        item.text = `${item.text.substring(0, itemPreviewOptions.limit)}...`;
      }
      // metadata
      const metadata = [];
      if (Array.isArray(item.metadata)) {
        item.metadata.forEach((group) => {
          const items = [];
          (group.items || []).forEach((metadataItem) => {
            items.push({
              ...metadataItem,
              label: _t(metadataItem.label)
            });
          });
          metadata.push({ items });
        });
      }
      return {
        ...item,
        metadata,
        classes: itemPreviewOptions.classes,
        anchor: {
          href: linksHelper.getRouterLink(item.link),
          queryParams: linksHelper.getQueryParams(item.link),
          target: '_blank'
        }
      };
    });
  }
}

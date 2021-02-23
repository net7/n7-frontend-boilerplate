import { ItemPreviewData, MetadataGroup } from '@n7-frontend/components';
import { DataSource, _t } from '@n7-frontend/core';
import { merge, clone } from 'lodash';
import helpers from '../../../common/helpers';
import linksHelper from '../../helpers/links-helper';

const ITEM_PREVIEW_DEFAULTS = {
  limit: 100,
  striptags: true
};

type MrSearchResponse = {
  limit: number;
  offset: number;
  results: MrSearchResult[];
  sort: string;
  total_count: number;
}

interface MrSearchResult extends ItemPreviewData {
  /** relative path */
  link: string;
  /** items that matched the search input */
  highlights?: {
    [x: string]: [string];
  };
  /** unique id for the search result entry */
  id: number;
}

export class MrSearchResultsDS extends DataSource {
  protected transform(data: MrSearchResponse) {
    const { results } = data;
    const { itemPreview } = this.options.config;
    const itemPreviewOptions = merge(clone(ITEM_PREVIEW_DEFAULTS), (itemPreview || {}));

    return results.map((item) => {
      if (typeof item.text === 'string') {
        // striptags
        if (itemPreviewOptions.striptags) {
          item.text = helpers.striptags(item.text);
        }
        // limit
        if (itemPreviewOptions.limit && (item.text.length > itemPreviewOptions.limit)) {
          item.text = `${item.text.substring(0, itemPreviewOptions.limit)}...`;
        }
      }
      // metadata
      const metadata: MetadataGroup[] = [];
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

      // add the highlights to the item's metadata
      if (item.highlights) {
        const highlightGroup: MetadataGroup = {
          items: [],
          classes: 'n7-item-preview__highlights'
        };
        Object.entries(item.highlights).forEach(([label, value]) => {
          value.forEach((_, i) => {
            highlightGroup.items.push(
              {
                // add a label only to the first entry
                label: i === 0 ? label : undefined,
                value: value[i],
              },
            );
          });
        });
        metadata.push(highlightGroup);
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

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

type HighlightItem = [string, [string]] | { link?: string; text?: string; label?: string }

interface MrSearchResult extends ItemPreviewData {
  /** relative path */
  link: string;
  /** items that matched the search input */
  highlights?: HighlightItem[];
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

      /*
        Add the highlights to the item's metadata with a custom group
      */
      if (item.highlights) {
        const highlightGroup = {
          title: _t('advancedsearch#highlights_title'),
          items: [],
          classes: 'n7-item-preview__highlights'
        };
        item.highlights.forEach((highlight: HighlightItem) => {
          // if the item is an array interpret it as [label, [value]]
          if (Array.isArray(highlight)) {
            highlightGroup.items.push({
              label: _t(highlight[0]),
              value: _t(highlight[1][0])
            });
          // if it's an object then it should have a custom hyperlink
          } else {
            highlightGroup.items.push({
              label: highlight.label ? _t(highlight.label) : undefined,
              value: highlight.text ?? '',
              href: `${item.link}${highlight.link}` ?? undefined, // custom hyperlink
            });
          }
        });
        metadata.push(highlightGroup);
      }

      return {
        ...item,
        metadata,
        classes: itemPreviewOptions.classes,
        anchor: item.link ? {
          href: linksHelper.getRouterLink(item.link),
          queryParams: linksHelper.getQueryParams(item.link),
          target: '_blank'
        } : undefined
      };
    });
  }
}

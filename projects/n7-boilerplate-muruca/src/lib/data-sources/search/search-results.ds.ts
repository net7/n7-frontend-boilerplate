import { ItemPreviewData, MetadataGroup } from '@net7/components';
import { DataSource, _t } from '@net7/core';
import { merge, clone } from 'lodash';
import { helpers } from '@net7/boilerplate-common';
import linksHelper from '../../helpers/links-helper';
import { MrLocaleService } from '../../services/locale.service';

type HighlightItem = [string, [string]] | {
  link?: {
    /** from the baseUrl of the application */
    absolute?: string;
    /** path relative to the item preview url */
    relative?: string;
    /** url query params in format key="value"&key2="value" */
    params?: string;
    /** include current url query params */
    query_string?: boolean;
  };
  text?: string;
  label?: string;
}

interface MrSearchResult extends ItemPreviewData {
  /** unique id for the search result entry */
  id: number;
  /** relative path */
  link?: string;
  /** route config id */
  routeId?: string;
  /** link query params */
  params?: object;
  /** link slug */
  slug?: string;
  /** items that matched the search input */
  highlights?: HighlightItem[];
  /** highlights title */
  highlightsTitle?: string;
  /** payload for item anchor */
  payload?: {
    action: string;
    id: string | number;
    type: string;
  };
}

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

export class MrSearchResultsDS extends DataSource {
  protected transform(data: MrSearchResponse) {
    const { results } = data;
    const { itemPreview, highlights: highlightsOptions } = this.options.config;
    const { localeService }: { localeService: MrLocaleService } = this.options;
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

      // link
      let anchor = null;
      if (item.routeId) {
        const routeLink = localeService.getLinkByRouteId(item.routeId, `${item.id}`, item.slug);
        anchor = {
          href: routeLink,
          queryParams: item.params || null,
        };
      } else if (item.link) {
        anchor = {
          href: linksHelper.getRouterLink(item.link),
          queryParams: linksHelper.getQueryParams(item.link),
        };
      } else if (item.payload) {
        anchor = {
          payload: {
            ...item.payload
          }
        };
      }

      if (item.routeId || item.link) {
        anchor.target = itemPreview?.linkTarget || '_blank';
      }

      /*
        Add the highlights to the item's metadata with a custom group
      */
      const highlights = [];
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
            const href = this.getHighlightLink(highlight, anchor.href);

            highlightGroup.items.push({
              label: highlight.label ? _t(highlight.label) : undefined,
              value: highlight.text ?? '',
              target: itemPreview?.linkTarget || '_blank',
              href, // custom hyperlink
            });
          }
        });
        highlights.push(highlightGroup);
      }

      return {
        ...item,
        metadata,
        anchor,
        highlights,
        highlightsHidden: !!highlightsOptions?.hidden,
        highlightsHasToggle: !!highlightsOptions?.hasToggle,
        classes: itemPreviewOptions.classes,
      };
    });
  }

  public getHighlightLink(highlight, itemLink) {
    let href = '';
    if (!highlight.link) {
      return href;
    }
    if (highlight.link.absolute) {
      // path is absolute
      href = `${highlight.link.absolute}`;
    } else {
      href = this.getHighlightRelativeUrl(highlight.link, itemLink);
      // path is relative to the item-preview url
    }
    return this.getHighlightParams(highlight.link, href);
  }

  public getHighlightRelativeUrl(highlightLink, href) {
    if (!highlightLink) {
      return '';
    }
    if (typeof highlightLink === 'string') {
      return `${href}${highlightLink}`;
    }
    if (highlightLink.relative) {
      return `${href}${highlightLink.relative}`;
    }
    return href;
  }

  public getHighlightParams(highlightLink, href) {
    const params = highlightLink.params ? [highlightLink.params] : [];
    // includes current query _string
    if (highlightLink.query_string) {
      params.push(document.location.search);
    }
    return linksHelper.joinQueryParams(href, params);
  }
}

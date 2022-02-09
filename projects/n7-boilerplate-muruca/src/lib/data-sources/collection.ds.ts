import { DataSource } from '@net7/core';
import { merge } from 'lodash';
import { helpers } from '@net7/boilerplate-common';
import linksHelper from '../helpers/links-helper';

const ITEM_PREVIEW_DEFAULTS = {
  limit: 100,
  striptags: true
};

type collectionResponse = {
  header: {
    title?: string;
    subtitle?: string;
    button?: any;
  };
  items: {
    text?: string;
    link?: string;
    title?: string;
    type?: string;
    payload?: any;
  }[];
}

export class MrCollectionDS extends DataSource {
  id: string;

  protected transform(data: collectionResponse): any {
    if (!data) return null;

    const { header, items } = data;

    // items check
    if (Array.isArray(items) && !items.length) {
      return null;
    }

    const { classes, itemPreview, linkTarget } = this.options;
    const itemPreviewOptions = merge(ITEM_PREVIEW_DEFAULTS, (itemPreview || {}));

    if ((header || {}).button) {
      const { link, text } = header.button;
      header.button = [{
        text,
        anchor: {
          href: linksHelper.getRouterLink(link),
          queryParams: linksHelper.getQueryParams(link)
        }
      }];
    }

    return {
      header: header ? {
        title: {
          main: {
            text: header.title,
            classes: 'bold'
          },
          secondary: header.subtitle ? {
            text: header.subtitle,
          } : null
        },
        actions: {
          buttons: header.button
        }
      } : null,
      items: items.map((item) => {
        let anchor = null;
        if (item.text) {
          // Sanitize HTML tags from the text content
          if (itemPreviewOptions.striptags) {
            item.text = helpers.striptags(item.text);
          }
          // Limit the length of the item preview text content
          if (itemPreviewOptions.limit && (item.text.length > itemPreviewOptions.limit)) {
            item.text = `${item.text.substring(0, itemPreviewOptions.limit)}...`;
          }
        }
        if (item.link) {
          anchor = {
            href: linksHelper.getRouterLink(item.link),
            queryParams: linksHelper.getQueryParams(item.link),
          };
          if (linkTarget) {
            anchor.target = linkTarget;
          }
        }
        if (item.payload) {
          anchor = {
            payload: {
              ...item.payload
            }
          };
        }
        return {
          ...item,
          anchor,
          classes: classes || ''
        };
      })
    };
  }
}

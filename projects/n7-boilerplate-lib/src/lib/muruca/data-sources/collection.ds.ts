import { DataSource } from '@n7-frontend/core';
import { merge } from 'lodash';
import helpers from '../../common/helpers';
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
  }[];
}

export class MrCollectionDS extends DataSource {
  id: string;

  protected transform(data: collectionResponse): any {
    if (data === undefined) { return null; }

    const { header, items } = data;
    const { classes, itemPreview } = this.options;
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
      header: {
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
      },
      items: items.map((item) => {
        // striptags
        if (itemPreviewOptions.striptags) {
          item.text = helpers.striptags(item.text);
        }
        // limit
        if (itemPreviewOptions.limit && (item.text.length > itemPreviewOptions.limit)) {
          item.text = `${item.text.substring(0, itemPreviewOptions.limit)}...`;
        }
        return {
          ...item,
          anchor: {
            href: linksHelper.getRouterLink(item.link),
            queryParams: linksHelper.getQueryParams(item.link)
          },
          classes: classes || ''
        };
      })
    };
  }
}

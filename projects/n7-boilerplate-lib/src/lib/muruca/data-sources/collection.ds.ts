import { DataSource } from '@n7-frontend/core';
import linksHelper from '../helpers/links-helper';

type collectionResponse = {
  header: {
    title?: string;
    subtitle?: string;
    button?: any;
  };
  items: {
    link?: string;
    title?: string;
    type?: string;
  }[];
}

export class MrCollectionDS extends DataSource {
  id: string;

  protected transform(data: collectionResponse): any {
    console.log({ data });
    if (data === undefined) { return null; }

    const { header, items } = data;
    const { classes } = this.options;

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
      items: items.map((item) => ({
        ...item,
        anchor: {
          href: linksHelper.getRouterLink(item.link),
          queryParams: linksHelper.getQueryParams(item.link)
        },
        classes: classes || ''
      }))
    };
  }
}

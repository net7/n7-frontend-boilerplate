import { DataSource } from '@n7-frontend/core';

export class MrCollectionDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    if (data === undefined) { return null; }

    const { header, items } = data;
    const { classes } = this.options;

    if ((header || {}).button) {
      header.button = [{
        text: header.button.text,
        anchor: {
          href: header.button.anchor
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
          } : false,
          actions: header.button ? {
            buttons: [
              {
                text: header.button.text,
                payload: header.button.link,
                classes: 'n7-btn-cta'
              }
            ]
          } : false
        },
        actions: {
          buttons: header.button
        }
      },
      items: items.map((item) => ({
        ...item,
        anchor: {
          href: item.anchor
        },
        classes: classes || ''
      }))
    };
  }
}

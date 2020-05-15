import { DataSource } from '@n7-frontend/core';

export class MrCollectionDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    if (data === undefined) { return null; }

    const { header, items } = data;
    const { classes } = this.options;

    if (header.button) {
      header.button = [{
        text: header.button.text,
        payload: header.button.anchor
      }];
    }

    return {
      header: {
        title: {
          main: {
            text: header.title,
            classes: 'bold'
          },
          actions: {
            buttons: [
              {
                text: header.button.text,
                payload: header.button.link,
                classes: 'n7-btn-cta'
              }
            ]
          }
        },
        actions: {
          buttons: header.button
        }
      },
      items: items.map((item) => ({ ...item, classes: classes || '' }))
    };
  }
}

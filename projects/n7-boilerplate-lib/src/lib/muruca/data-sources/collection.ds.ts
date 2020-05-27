import { DataSource } from '@n7-frontend/core';

export class MrCollectionDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    if (data === undefined) { return null; }

    const { header, items } = data;
    const { classes } = this.options;

    return {
      header: {
        title: {
          main: {
            text: header.title,
            classes: 'bold'
          },
          secondary: {
            text: header.subtitle,
            classes: 'italic'
          }
        },
        actions: {
          buttons: [
            {
              text: header.button.text,
              payload: header.button.link,
            }
          ]
        }
      },
      items: items.map((item) => ({ ...item, classes: classes || '' }))
    };
  }
}

import { DataSource } from '@n7-frontend/core';

export class MrInnerTitleDS extends DataSource {
  protected transform(data: any): any {
    const { title, subtitle, button } = data;
    return {
      title: {
        main: {
          text: title,
          classes: 'bold'
        },
        secondary: {
          text: subtitle,
          classes: 'italic'
        }
      },
      actions: button ? {
        buttons: [
          {
            anchor: {
              href: button.link,
            },
            text: button.text,
            classes: 'n7-btn-cta'
          }
        ]
      } : null
    };
  }
}

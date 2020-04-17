import { DataSource } from '@n7-frontend/core';

export class MrInnerTitleDS extends DataSource {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      actions: {
        buttons: [
          {
            text: button.text,
            payload: button.link,
            classes: 'n7-btn-cta'
          }
        ]
      }
    };
  }
}

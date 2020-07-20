import { DataSource } from '@n7-frontend/core';
import linksHelper from '../helpers/links-helper';

export class MrInnerTitleDS extends DataSource {
  protected transform(data: any): any {
    const { title, description, button } = data;
    return {
      title: {
        main: {
          text: title,
          classes: 'bold'
        },
        secondary: {
          text: description,
          classes: 'italic'
        }
      },
      actions: button && button.link ? {
        buttons: [
          {
            anchor: {
              href: linksHelper.getRouterLink(button.link),
              queryParams: linksHelper.getQueryParams(button.link)
            },
            text: button.text,
            classes: 'n7-btn-cta'
          }
        ]
      } : null
    };
  }
}

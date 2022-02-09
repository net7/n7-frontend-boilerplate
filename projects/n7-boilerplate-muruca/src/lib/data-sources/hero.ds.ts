import { DataSource } from '@net7/core';
import linksHelper from '../helpers/links-helper';

export class MrHeroDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    const { classes, background } = this.options;
    const {
      text, image, title, button
    } = data;
    const backgroundImage = background ? image : null;

    return {
      text,
      title,
      classes,
      backgroundImage,
      image: !backgroundImage ? image : null,
      button: button && button.link ? {
        ...button,
        anchor: {
          href: linksHelper.getRouterLink(button.link),
          queryParams: linksHelper.getQueryParams(button.link)
        }
      } : null
    };
  }
}

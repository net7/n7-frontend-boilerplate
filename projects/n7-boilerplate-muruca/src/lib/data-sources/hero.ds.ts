import { DataSource } from '@net7/core';
import linksHelper from '../helpers/links-helper';
import { MrLocaleService } from '../services/locale.service';

export class MrHeroDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    const { classes, background } = this.options;

    const { localeService }: { localeService: MrLocaleService } = this.options;

    const {
      text, image, title, button
    } = data;
    const backgroundImage = background ? image : null;

    // link
    let anchor = null;
    if (button?.routeId) {
      const routeLink = localeService.getLinkByRouteId(button.routeId, button.id, button.slug);
      anchor = {
        href: routeLink,
        queryParams: button.params || null,
      };
    } else if (button?.link) {
      anchor = {
        href: linksHelper.getRouterLink(button.link),
        queryParams: linksHelper.getQueryParams(button.link),
      };
    }

    return {
      text,
      title,
      classes,
      backgroundImage,
      image: !backgroundImage ? image : null,
      button: button && anchor ? {
        ...button,
        anchor,
      } : null
    };
  }
}

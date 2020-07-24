import { DataSource } from '@n7-frontend/core';
import linksHelper from '../../helpers/links-helper';

export class MrSearchResultsDS extends DataSource {
  protected transform(data) {
    const { results } = data;
    const { itemPreview } = this.options.config;
    const classes = itemPreview && itemPreview.classes ? itemPreview.classes : '';

    return results.map((item) => ({
      ...item,
      classes,
      anchor: {
        href: linksHelper.getRouterLink(item.link),
        queryParams: linksHelper.getQueryParams(item.link),
        target: '_blank'
      }
    }));
  }
}

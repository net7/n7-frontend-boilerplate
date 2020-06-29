import { DataSource } from '@n7-frontend/core';

export class MrSearchResultsDS extends DataSource {
  protected transform(data) {
    const { results } = data;
    const { resourcePath, itemPreview } = this.options.config;
    const classes = itemPreview && itemPreview.classes ? itemPreview.classes : '';

    return results.map((item) => ({
      ...item,
      classes,
      anchor: {
        href: `${resourcePath}/${item.id}`,
        target: '_blank'
      }
    }));
  }
}

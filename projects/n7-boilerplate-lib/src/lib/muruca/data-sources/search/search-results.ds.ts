import { DataSource } from '@n7-frontend/core';

export class MrSearchResultsDS extends DataSource {
  protected transform(data) {
    const { results } = data;
    const { resourcePath } = this.options.config;

    return results.map((item) => ({
      ...item,
      anchor: {
        href: `${resourcePath}/${item.id}`,
        target: '_blank'
      }
    }));
  }
}

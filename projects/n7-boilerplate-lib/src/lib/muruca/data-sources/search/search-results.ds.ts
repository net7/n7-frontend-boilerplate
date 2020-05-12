import { DataSource } from '@n7-frontend/core';

export class MrSearchResultsDS extends DataSource {
  protected transform(data) {
    const { results } = data;

    return results;
  }
}

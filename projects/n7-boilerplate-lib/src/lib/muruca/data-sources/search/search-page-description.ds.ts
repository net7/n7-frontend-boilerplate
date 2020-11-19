import { DataSource, _t } from '@n7-frontend/core';
import { SearchPageDescriptionData } from '../../components/search-page-description/search-page-description';

export class MrSearchPageDescriptionDS extends DataSource {
  protected transform(data): SearchPageDescriptionData {
    const { description } = this.options.config;

    if (!description) {
      return null;
    }

    const { linkText } = description;

    return {
      text: data,
      link: {
        text: _t(linkText),
        payload: true
      }
    };
  }
}

import { DataSource, _t } from '@net7/core';
import { SearchPageDescriptionData } from '../../components/search-page-description/search-page-description';

export class MrSearchPageDescriptionDS extends DataSource {
  protected transform(data): SearchPageDescriptionData {
    const { description } = this.options.config;

    if (!description) {
      return null;
    }

    const { linkText } = description;
    const { text } = data;

    return {
      text,
      link: {
        text: _t(linkText),
        payload: true
      }
    };
  }
}

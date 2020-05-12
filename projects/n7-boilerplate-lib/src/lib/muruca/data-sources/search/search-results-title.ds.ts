import { DataSource } from '@n7-frontend/core';

export class MrSearchResultsTitleDS extends DataSource {
  protected transform(data) {
    const {
      totalResultsText,
      sort
    } = this.options.config;
    const { totalCount } = data;

    return {
      title: {
        main: {
          text: totalCount
        },
        secondary: {
          text: totalResultsText[totalCount === 1 ? 1 : 0]
        }
      },
      actions: {
        select: {
          label: sort.label,
          options: sort.options.map(({ label, value, selected }) => ({
            value,
            selected,
            text: label
          })),
          payload: 'sort'
        }
      }
    };
  }
}

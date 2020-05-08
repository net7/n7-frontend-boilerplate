import { DataSource } from '@n7-frontend/core';

export class MrSearchResultsTitleDS extends DataSource {
  protected transform(data) {
    const {
      totalResultsText,
      sortLabel,
      sortOptions
    } = this.options.config;
    const { total } = data;

    return {
      title: {
        main: {
          text: total
        },
        secondary: {
          text: totalResultsText[total === 1 ? 1 : 0]
        }
      },
      actions: {
        select: {
          label: sortLabel,
          options: sortOptions.map(({ label, value, selected }) => ({
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

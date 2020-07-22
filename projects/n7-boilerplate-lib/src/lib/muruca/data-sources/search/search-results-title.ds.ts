import { DataSource } from '@n7-frontend/core';

export class MrSearchResultsTitleDS extends DataSource {
  protected transform(data) {
    const {
      totalResultsText,
      sort
    } = this.options.config;
    const { total_count: totalCount, sort: currentSort } = data;
    const mainText = `<strong>${totalCount || 0}</strong> ${totalResultsText[totalCount === 1 ? 1 : 0]}`;

    return {
      title: {
        main: {
          text: mainText
        }
      },
      actions: {
        select: {
          label: sort.label,
          options: sort.options.map(({
            label, value, selected, disabled
          }) => ({
            value,
            disabled,
            selected: currentSort ? value === currentSort : selected,
            text: label
          })),
          payload: 'sort'
        }
      }
    };
  }

  OnInputQueryChange(value) {
    const { sort } = this.options.config;
    sort.options.forEach((option) => {
      if (option.value === '_score') {
        option.disabled = !value;
      }
    });
    this.update(this.input);
  }
}

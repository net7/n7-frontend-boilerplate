import { DataSource } from '@n7-frontend/core';
import { SchedaDropdownData } from '../components';

export class AwSchedaDropdownDS extends DataSource {
  protected transform(response): SchedaDropdownData {
    const { digitalObjects } = response;
    const firstObject = digitalObjects[0];
    return {
      header: {
        label: firstObject.label,
        icon: {
          id: 'n7-icon-caret-down'
        },
        payload: 'header-click',
      },
      items: digitalObjects.map(({ label }, index) => ({
        label,
        payload: index,
        selected: index === 0
      }))
    };
  }

  onChange(payload) {
    this.output.items.forEach((item) => {
      item.selected = item.payload === payload;
      if (item.selected) {
        this.output.header.label = item.label;
      }
    });
  }
}

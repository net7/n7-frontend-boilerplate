import { DataSource } from '@net7/core';
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
        payload: 'toggle',
      },
      items: digitalObjects.map(({ label, type }, index) => ({
        label,
        type,
        payload: index,
        selected: index === 0,
      }))
    };
  }

  toggle() {
    const { classes } = this.output;
    this.output.classes = classes ? null : 'is-open';
  }

  onChange(payload) {
    // link check
    if (this.output.items[payload].type !== 'external') {
      this.output.items.forEach((item) => {
        item.selected = item.payload === payload;
        if (item.selected) {
          this.output.header.label = item.label;
        }
      });
    }
    // close
    this.toggle();
  }
}

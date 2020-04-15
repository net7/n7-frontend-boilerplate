import { DataSource } from '@n7-frontend/core';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string[];

// FIXME: mettere interfaccia checkbox da components
type CHECKBOX_DATA = {
  value: string;
  label: string;
  checked?: boolean;
};

// FIXME: mettere interfaccia data da components
type FACET_DATA = {
  items: CHECKBOX_DATA[];
  classes?: string;
  payload?: any;
};


export class FacetCheckboxDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE;

  protected transform(data: FACET_DATA): FACET_DATA {
    return data;
  }

  setValue(value: FACET_VALUE, update = false) {
    this.value = value;

    if (update) {
      const { items } = this.input;
      const updatedItems = items.map((item: CHECKBOX_DATA) => ({
        ...item,
        checked: value.indexOf(item.value) !== -1
      }));
      this.update({
        ...this.input,
        items: updatedItems
      });
    }
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = [];
  }
}

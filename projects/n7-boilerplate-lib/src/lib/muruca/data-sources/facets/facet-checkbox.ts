import { DataSource } from '@n7-frontend/core';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string[];

// FIXME: mettere interfaccia checkbox da components
type FACET_DATA = {
  value: string;
  label: string;
  checked?: boolean;
}[];


export class FacetCheckboxDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE;

  protected transform(data: FACET_DATA): FACET_DATA {
    return data;
  }

  setValue(value: FACET_VALUE) {
    this.value = value;

    const newData = this.input.map((item) => ({
      ...item,
      checked: value.indexOf(item.value) !== -1
    }));
    this.update(newData);
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = [];
  }
}

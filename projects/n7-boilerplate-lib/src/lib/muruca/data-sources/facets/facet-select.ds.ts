import { DataSource } from '@n7-frontend/core';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string | null;

// FIXME: mettere interfaccia select da components
type SELECT_DATA = {
  value: string;
  label: string;
  selected?: boolean;
};

// FIXME: mettere interfaccia data da components
type FACET_DATA = {
  options: SELECT_DATA[];
  classes?: string;
  payload: any;
};


export class FacetSelectDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE;

  protected transform(data: FACET_DATA): FACET_DATA {
    return data;
  }

  setValue(value: FACET_VALUE, update = false) {
    this.value = value;

    if (update) {
      const { options } = this.input;
      const updatedOptions = options.map((option: SELECT_DATA) => ({
        ...option,
        selected: value === option.value
      }));
      this.update({
        ...this.input,
        options: updatedOptions
      });
    }
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = null;
  }
}

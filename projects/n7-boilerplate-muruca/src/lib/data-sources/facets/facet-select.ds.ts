import { DataSource } from '@net7/core';
import { InputSelectData } from '@net7/components';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string | null;

export class FacetSelectDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE;

  protected transform(data: InputSelectData): InputSelectData {
    return data;
  }

  setValue(value: FACET_VALUE, update = false) {
    this.value = value;

    if (update) {
      const { options } = this.input;
      const updatedOptions = options.map((option) => ({
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

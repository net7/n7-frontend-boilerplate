import { DataSource } from '@n7-frontend/core';
import { InputTextData } from '@n7-frontend/components';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string | null;

export class FacetTextDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE;

  protected transform(data: InputTextData): InputTextData {
    return data;
  }

  setValue(value: FACET_VALUE, update = false) {
    this.value = value;

    if (update) {
      this.update({
        ...this.input,
        value
      });

      // fix element update
      const el = document.getElementById(this.output.id) as HTMLInputElement;
      if (el) {
        el.value = value;
      }
    }
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = null;
  }
}

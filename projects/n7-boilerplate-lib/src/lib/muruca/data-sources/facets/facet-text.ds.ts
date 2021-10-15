import { DataSource, _t } from '@n7-frontend/core';
import { InputTextData } from '@n7-frontend/components';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string | number | null;

export class FacetTextDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE;

  protected transform(data: InputTextData): InputTextData {
    return {
      ...data,
      placeholder: _t(data.placeholder)
    };
  }

  setValue(value: FACET_VALUE, update = false) {
    this.value = value;

    if (update) {
      this.update({
        ...this.input,
        value: value || value === 0 ? `${value}` : null
      });

      // fix element update
      const el = document.getElementById(this.output.id) as HTMLInputElement;
      if (el) {
        el.value = value || value === 0 ? `${value}` : null;
      }
    }
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = null;
  }
}

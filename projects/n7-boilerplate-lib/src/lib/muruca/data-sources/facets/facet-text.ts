import { DataSource } from '@n7-frontend/core';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string | null;

export class FacetTextDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE;

  protected transform(data: string): string {
    return data;
  }

  setValue(value: FACET_VALUE) {
    this.value = value;
    this.update(value);
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = null;
  }
}

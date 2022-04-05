import { DataSource, _t } from '@net7/core';
import { FacetHeaderData } from '@net7/components';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string | null;
const ICON_OPEN = 'n7-icon-angle-up';
const ICON_CLOSE = 'n7-icon-angle-down';

export class FacetHeaderDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE;

  protected transform(data: FacetHeaderData): FacetHeaderData {
    return {
      ...data,
      text: _t(data.text),
      iconRight: data.iconRight || ICON_OPEN
    };
  }

  setValue(value: FACET_VALUE, update = false) {
    this.value = value;

    if (update) {
      this.update({
        ...this.input,
        additionalText: value
      });
    }
  }

  getValue = (): FACET_VALUE => this.value;

  toggle() {
    let { iconRight } = this.output;
    iconRight = iconRight === ICON_OPEN ? ICON_CLOSE : ICON_OPEN;
    this.update({
      ...this.input,
      iconRight
    });
  }

  isOpen() {
    return this.output.iconRight === ICON_OPEN;
  }

  clear() {
    this.value = null;
  }
}

import { DataSource } from '@n7-frontend/core';
import { InputCheckbox, InputCheckboxData } from '@n7-frontend/components';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string[];

export class FacetCheckboxDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE = [];

  protected transform(data: InputCheckboxData): InputCheckboxData {
    return data;
  }

  setValue(value: FACET_VALUE, update = false) {
    this.value = Array.isArray(value) ? value : [value];

    if (update) {
      const { checkboxes } = this.input;
      const updatedCheckboxes = checkboxes.map((checkbox: InputCheckbox) => ({
        ...checkbox,
        checked: this.value.indexOf(checkbox.payload) !== -1
      }));
      this.update({
        ...this.input,
        checkboxes: updatedCheckboxes
      });
    }
  }

  toggleValue({ inputPayload, value: isChecked }) {
    const exists = this.value.indexOf(inputPayload) !== -1;
    if (isChecked && !exists) {
      this.value.push(inputPayload);
    } else if (!isChecked && exists) {
      this.value.splice(this.value.indexOf(inputPayload), 1);
    }
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = [];
  }
}

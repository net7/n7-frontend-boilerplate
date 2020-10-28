import { DataSource, _t } from '@n7-frontend/core';
import { InputCheckboxData } from '@n7-frontend/components';
import { MrFormInputState, MrInputDataSource } from '../../interfaces/form.interface';

type MrInputCheckboxValue = string[];

// eslint-disable-next-line max-len
export class MrInputCheckboxDS extends DataSource implements MrInputDataSource<MrInputCheckboxValue> {
  public id: string;

  public state: MrFormInputState<MrInputCheckboxValue> = {
    value: [],
    disabled: false,
    hidden: false,
  };

  protected transform(data: InputCheckboxData): InputCheckboxData {
    return {
      ...data,
      checkboxes: this.getCheckboxes(data.checkboxes)
    };
  }

  getState = () => this.state;

  setState(newState: MrFormInputState<MrInputCheckboxValue>) {
    this.state = {
      ...this.state,
      ...newState
    };
    this.refresh();
  }

  clear() {
    this.setState({ value: [] });
  }

  refresh() {
    const { hidden } = this.state;

    // render value
    this.output.checkboxes = this.getCheckboxes(this.output.checkboxes);

    // render hidden
    this.output.classes = hidden ? 'is-hidden' : '';
  }

  toggleValue({ inputPayload, value: isChecked }) {
    const { value } = this.state;
    const exists = !!(value.includes(inputPayload));
    if (isChecked && !exists) {
      value.push(inputPayload);
    } else if (!isChecked && exists) {
      value.splice(value.indexOf(inputPayload), 1);
    }
    this.setState({ value });
  }

  private getCheckboxes(checkboxes) {
    const { value, disabled } = this.state;
    return checkboxes.map((checkbox) => ({
      ...checkbox,
      disabled,
      label: _t(checkbox.label),
      checked: !!(value.includes(checkbox.payload))
    }));
  }
}

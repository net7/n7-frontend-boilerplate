import { DataSource, _t } from '@net7/core';
import { InputTextData } from '@net7/components';
import { MrFormInputState, MrInputDataSource } from '../../interfaces/form.interface';

export type MrInputTextValue = string | null;

export class MrInputTextDS extends DataSource implements MrInputDataSource<MrInputTextValue> {
  public id: string;

  public state: MrFormInputState<MrInputTextValue> = {
    value: null,
    disabled: false,
    hidden: false,
  };

  protected transform(data: InputTextData): InputTextData {
    return {
      ...data,
      placeholder: _t(data.placeholder)
    };
  }

  getState = () => this.state;

  setState(newState: MrFormInputState<MrInputTextValue>) {
    this.state = {
      ...this.state,
      ...newState
    };
    this.refresh();
  }

  clear() {
    this.setState({ value: null });
  }

  refresh() {
    const { value, hidden, disabled } = this.state;

    // render value
    this.output.value = value;
    // fix element update
    const el = document.getElementById(this.id) as HTMLInputElement;
    if (el) {
      el.value = value;
    }

    // render disabled
    this.output.disabled = disabled;

    // render hidden
    this.output.classes = hidden ? 'is-hidden' : '';
  }
}

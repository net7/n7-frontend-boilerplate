import { DataSource, _t } from '@n7-frontend/core';
import { InputTextData } from '@n7-frontend/components';
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
  }

  setValue(value: MrInputTextValue) {
    this.state.value = value;
  }

  hide() {
    this.state.hidden = true;
  }

  show() {
    this.state.hidden = false;
  }

  disable() {
    this.state.disabled = true;
  }

  enable() {
    this.state.disabled = false;
  }

  clear() {
    this.setValue(null);
  }

  refresh() {
    const { value, hidden, disabled } = this.state;

    // handle value
    this.output.value = value;
    // fix element update
    const el = document.getElementById(this.id) as HTMLInputElement;
    if (el) {
      el.value = value;
    }

    // handle disabled
    this.output.disabled = disabled;

    // handle hidden
    this.output.classes = hidden ? 'is-hidden' : '';
  }
}

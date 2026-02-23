import { DataSource, _t } from '@net7/core';
import { MrFormInputState, MrInputDataSource } from '../../interfaces/form.interface';

export type MrInputTypeaheadValue = string | null;

export class MrInputTypeaheadDS extends DataSource implements MrInputDataSource<MrInputTypeaheadValue> {
  public id: string;

  public state: MrFormInputState<MrInputTypeaheadValue> = {
    value: null,
    disabled: false,
    hidden: false,
  };

  protected transform(data: any): any {
    return {
      ...data,
      placeholder: _t(data.placeholder)
    };
  }

  getState = () => this.state;

  setState(newState: MrFormInputState<MrInputTypeaheadValue>) {
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
    // fix element update (same DOM hack as MrInputTextDS)
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

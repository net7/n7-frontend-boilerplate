import { DataSource, _t } from '@net7/core';
import { InputSelectData } from '@net7/components';
import { MrFormInputState, MrInputDataSource } from '../../interfaces/form.interface';

type MrInputSelectValue = string | null;

export class MrInputSelectDS extends DataSource implements MrInputDataSource<MrInputSelectValue> {
  public id: string;

  public state: MrFormInputState<MrInputSelectValue> = {
    value: null,
    disabled: false,
    hidden: false,
  };

  protected transform(data: InputSelectData): InputSelectData {
    return {
      ...data,
      options: this.getOptions(data.options)
    };
  }

  getState = () => this.state;

  setState(newState: MrFormInputState<MrInputSelectValue>) {
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
    const { hidden, disabled } = this.state;

    // render value
    this.output.options = this.getOptions(this.output.options);

    // render disabled
    this.output.disabled = disabled;

    // render hidden
    this.output.classes = hidden ? 'is-hidden' : '';
  }

  private getOptions(options) {
    const { value } = this.state;
    return options.map((option) => ({
      ...option,
      label: _t(option.label),
      selected: value === option.value
    }));
  }
}

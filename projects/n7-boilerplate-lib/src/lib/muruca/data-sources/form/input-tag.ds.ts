import { DataSource } from '@n7-frontend/core';
import { MrFormInputState, MrInputDataSource } from '../../interfaces/form.interface';

export type MrInputTagValue = string | null;

export class MrInputTagDS extends DataSource implements MrInputDataSource<MrInputTagValue> {
  public id: string;

  public state: MrFormInputState<MrInputTagValue> = {
    value: null,
    disabled: false,
    hidden: false,
  };

  protected transform(data: any): any {
    return data;
  }

  getState = () => this.state;

  setState(newState: MrFormInputState<MrInputTagValue>) {
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
    // do nothing
  }
}

import { DataSource } from '@n7-frontend/core';
import { MrFormInputState } from '../../interfaces/form.interface';

export abstract class MrInputDS extends DataSource {
  public id: string;

  protected abstract state: MrFormInputState;

  getState = () => this.state;

  setState(newState: Partial<MrFormInputState>) {
    this.state = {
      ...this.state,
      ...newState
    };
  }

  clear() {
    this.setState({ value: null });
  }

  abstract refresh(): void;
}

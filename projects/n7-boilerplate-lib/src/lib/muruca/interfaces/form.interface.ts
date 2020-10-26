import { MrFormService } from '../services/form.service';

export type MrFormInputState<T> = {
  value?: T;
  disabled?: boolean;
  hidden?: boolean;
}

export interface MrInputDataSource<T> {
  id: string;
  state: MrFormInputState<T>;
  getState(): MrFormInputState<T>;
  setState(state: MrFormInputState<T>): void;
  setValue(value: T): void;
  hide(): void;
  show(): void;
  disable(): void;
  enable(): void;
  clear(): void;
  refresh(): void;
}

export interface MrInputEventHandler {
  form: MrFormService;
}

export interface MrFormConfig {
  sections: MrFormConfigSection[];
}

export interface MrFormConfigSection {
  id: string;
  inputs: MrFormConfigInput<any>[];
  options?: {
    classes?: string;
  };
}

export interface MrFormConfigInput<T> {
  id: string;
  type: string;
  data: object;
  state?: MrFormInputState<T>;
  options?: {
    classes?: string;
  };
}

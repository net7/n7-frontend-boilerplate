import { Subject } from 'rxjs';

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
  clear(): void;
  refresh(): void;
}

export interface MrInputEventHandler {
  changed$: Subject<MrChangedParams>;
}

export interface MrChangedParams {
  id: string;
  state: MrFormInputState<any>;
}

export interface MrFormConfig {
  sections: MrFormConfigSection[];
  groups?: MrFormConfigGroup[];
}

export interface MrFormConfigSection {
  id: string;
  inputs: MrFormConfigInput<any>[];
  classes?: string;
}

export interface MrFormConfigGroup {
  id: string;
  sections: string[];
  classes?: string;
  options?: any;
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

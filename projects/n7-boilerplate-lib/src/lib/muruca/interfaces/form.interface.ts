export type MrFormInputState = {
  value?: any;
  disabled?: boolean;
  hidden?: boolean;
}

export type MrFormInputTriggerAction = 'setstate' | 'clear' | 'refresh';

export interface MrFormConfig {
  sections: MrFormConfigSection[];
}

export interface MrFormConfigSection {
  id: string;
  inputs: MrFormConfigInput[];
  options?: {
    classes?: string;
  };
}

export interface MrFormConfigInput {
  id: string;
  type: string;
  data: object;
  state?: MrFormInputState;
  options?: {
    classes?: string;
  };
}

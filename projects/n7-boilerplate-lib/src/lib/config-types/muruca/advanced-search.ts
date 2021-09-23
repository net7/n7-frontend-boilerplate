import { InputCheckboxData, InputSelectData, InputTextData } from '@n7-frontend/components';
import { ConfigMurucaLayout } from './layouts';

export interface ConfigMurucaAdvancedSearchLayout extends ConfigMurucaLayout {
  resultsUrl: string;
  formConfig: {
    submitButton: {
      label: string;
    };
    resetButton: {
      label: string;
    };
    groups: Array<{
      id: string;
      sections: string[];
      classes?: string;
      options?: {
        label: string;
        isOpen?: boolean;
        showHeader?: boolean;
      };
    }>;
    sections: ConfigMurucaAdvancedSearchSection[];
  };
}

export interface ConfigMurucaAdvancedSearchSection {
  id: string;
  title?: string;
  grid?: number;
  description?: string;
  advancedSection?: boolean;
  inputs: (
    ConfigMurucaAdvancedSearchInputText<unknown>
    | ConfigMurucaAdvancedSearchInputCheckbox<unknown>
    | ConfigMurucaAdvancedSearchInputSelect<unknown>
    // FIXME: custom inputs
    // | ConfigMurucaAdvancedSearchInputCustom<unknown>
  )[];
}

export interface ConfigMurucaAdvancedSearchInput<T> {
  id: string;
  state?: {
    value: T;
    disabled?: boolean;
    hidden?: boolean;
  };
}

export interface ConfigMurucaAdvancedSearchInputText<T>
  extends ConfigMurucaAdvancedSearchInput<T> {
  type: 'text';
  data: InputTextData;
}

export interface AdvancedInputCheckboxData extends InputCheckboxData {
  id: string;
}

export interface ConfigMurucaAdvancedSearchInputCheckbox<T>
  extends ConfigMurucaAdvancedSearchInput<T> {
  type: 'checkbox';
  data: AdvancedInputCheckboxData;
}

export interface ConfigMurucaAdvancedSearchInputSelect<T>
  extends ConfigMurucaAdvancedSearchInput<T> {
  type: 'select';
  data: InputSelectData;
}

// FIXME: custom inputs
// export interface ConfigMurucaAdvancedSearchInputCustom<T>
//   extends ConfigMurucaAdvancedSearchInput<T> {
//   type: string;
//   data: object;
// }

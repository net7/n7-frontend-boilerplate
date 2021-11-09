import {
  InputCheckboxData, InputSelectData, InputTextData, MapData
} from '@n7-frontend/components';
import { ConfigMurucaLayout } from './layouts';

export interface ConfigMurucaAdvancedSearchLayout extends ConfigMurucaLayout {
  /** results page url */
  resultsUrl: string;
  formConfig: {
    /** form submit button  */
    submitButton: {
      label: string;
    };
    /** form reset button  */
    resetButton: {
      label: string;
    };
    /** form groups (form accordion section) */
    groups: {
      /** id (unique) */
      id: string;
      /** group sections (id) [section1, section2, ...] */
      sections: string[];
      /** aditional css classes */
      classes?: string;
      /** aditional options */
      options?: {
        /** group label */
        label: string;
        /** group is (visually) open? */
        isOpen?: boolean;
        /** show group header? */
        showHeader?: boolean;
      };
    }[];
    sections: ConfigMurucaAdvancedSearchSection[];
  };
}

export interface ConfigMurucaAdvancedSearchSection {
  /** id (unique) */
  id: string;
  /** section title */
  title?: string;
  /** section description text */
  description?: string;
  /** is advanced? for css purposes */
  advancedSection?: boolean;
  /** section inputs */
  inputs: (
    ConfigMurucaAdvancedSearchInputText<unknown>
    | ConfigMurucaAdvancedSearchInputCheckbox<unknown>
    | ConfigMurucaAdvancedSearchInputSelect<unknown>
    | ConfigMurucaAdvancedSearchInputMap<unknown>
    // FIXME: custom inputs
    // | ConfigMurucaAdvancedSearchInputCustom<unknown>
  )[];
}

export interface ConfigMurucaAdvancedSearchInput<T> {
  id: string;
  /** input state */
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

// Allow embedding of map-component into the search facets
export interface ConfigMurucaAdvancedSearchInputMap<T>
  extends ConfigMurucaAdvancedSearchInput<T> {
  type: 'map';
  data: MapData;
}

// FIXME: custom inputs
// export interface ConfigMurucaAdvancedSearchInputCustom<T>
//   extends ConfigMurucaAdvancedSearchInput<T> {
//   type: string;
//   data: object;
// }

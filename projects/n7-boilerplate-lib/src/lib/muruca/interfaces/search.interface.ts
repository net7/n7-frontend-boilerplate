import {
  InputCheckboxData,
  InputLinkData,
  InputTextData,
  InputSelectData,
  FacetHeaderData,
} from '@n7-frontend/components';

export interface MrInputSchema {
  valueType: 'string' | 'number' | 'boolean';
  multiple?: boolean;
}

export interface MrInputHeaderData {
  id: string;
  data: FacetHeaderData;
  delay?: number;
}

export interface MrSearchLayoutInput {
  id: string;
  schema: MrInputSchema;
  queryParam?: boolean;
  value?: string | string[] | boolean | null;
}

export interface MrSearchFacetsInput {
  id: string;
  schema: MrInputSchema;
  queryParam?: boolean;
  delay?: number;
  value?: string | string[] | boolean | null;
}

export interface MrSearchInputText extends MrSearchFacetsInput {
  type: 'text';
  data: InputTextData;
}

export interface MrSearchInputSelect extends MrSearchFacetsInput {
  type: 'select';
  data: InputSelectData;
}

export interface MrSearchInputCheckbox extends MrSearchFacetsInput {
  type: 'checkbox';
  data: InputCheckboxData;
}

export interface MrSearchInputLink extends MrSearchFacetsInput {
  type: 'link';
  data: InputLinkData;
  limit?: number;
}

export interface MrSearchFacetsSection {
  /**
   * Section id (must be unique)
   */
  id: string;
  /**
   * Section header
   */
  header?: MrInputHeaderData;
  /**
   * Section inputs (allowed types: text, checkbox, select, link)
   */
  inputs: (
    MrSearchInputText
    | MrSearchInputCheckbox
    | MrSearchInputSelect
    | MrSearchInputLink
  )[];
  /**
   * Section aditional css classes
   */
  classes?: string;
}

export interface MrSearchFacetsConfig {
  sections: MrSearchFacetsSection[];
  classes?: string;
}

export interface MrSearchConfig {
  request: {
    results: {
      id: string;
      delay?: number;
      provider?: string;
    };
    facets: {
      id: string;
      delay?: number;
      provider?: string;
    };
  };
  facets: MrSearchFacetsConfig;
  layoutInputs: MrSearchLayoutInput[];
}

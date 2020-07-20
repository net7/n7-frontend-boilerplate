import {
  InputCheckboxData,
  InputLinkData,
  InputTextData,
  InputSelectData,
  FacetHeaderData,
} from '@n7-frontend/components';

type InputType = 'text' | 'checkbox' | 'select' | 'link';

type ValueType = 'string' | 'number' | 'boolean';

export interface InputSchema {
  valueType: ValueType;
  multiple?: boolean;
}

export interface InputHeaderData {
  id: string;
  data: FacetHeaderData;
  delay?: number;
}

export interface SearchLayoutInput {
  id: string;
  schema: InputSchema;
  queryParam?: boolean;
  value?: string | string[] | boolean | null;
}

export interface SearchFacetsInput {
  id: string;
  type: InputType;
  data: InputCheckboxData | InputLinkData | InputSelectData | InputTextData;
  schema: InputSchema;
  queryParam?: boolean;
  delay?: number;
  value?: string | string[] | boolean | null;
}

export interface SearchFacetsSection {
  id: string;
  header: InputHeaderData;
  inputs: SearchFacetsInput[];
  classes?: string;
}

export interface SearchFacetsConfig {
  sections: SearchFacetsSection[];
  classes?: string;
}

export interface SearchConfig {
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
  facets: SearchFacetsConfig;
  layoutInputs: SearchLayoutInput[];
}

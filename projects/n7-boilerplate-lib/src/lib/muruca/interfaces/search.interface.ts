import {
  InputCheckboxData,
  InputLinkData,
  InputTextData,
  InputSelectData,
  FacetHeaderData,
} from '@n7-frontend/components';

type InputType = 'text' | 'checkbox' | 'select' | 'link';

type ValueType = 'string' | 'number' | 'boolean';

export interface MrInputSchema {
  valueType: ValueType;
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
  type: InputType;
  data: InputCheckboxData | InputLinkData | InputSelectData | InputTextData;
  schema: MrInputSchema;
  queryParam?: boolean;
  delay?: number;
  value?: string | string[] | boolean | null;
}

export interface MrSearchFacetsSection {
  id: string;
  header: MrInputHeaderData;
  inputs: MrSearchFacetsInput[];
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

import {
  InputCheckboxData,
  InputLinkData,
  InputTextData,
  InputSelectData,
  FacetHeaderData,
} from '@n7-frontend/components';

type InputType = 'text' | 'checkbox' | 'select' | 'link';

type ValueType = 'string' | 'number' | 'boolean';

interface InputHeaderData {
  id: string;
  data: FacetHeaderData;
  delay?: number;
}

interface SearchLayoutInput {
  id: string;
  queryParam?: boolean;
  value?: string | string[] | boolean | null;
}

interface SearchFacetsInput {
  id: string;
  type: InputType;
  data: InputCheckboxData | InputLinkData | InputSelectData | InputTextData;
  schema: {
    valueType: ValueType;
    multiple?: boolean;
  };
  queryParam?: boolean;
  delay?: number;
  value?: string | string[] | boolean | null;
}

interface SearchFacetsSection {
  header: InputHeaderData;
  inputs: SearchFacetsInput[];
  classes?: string;
}

interface SearchFacetsConfig {
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
    links: {
      id: string;
      delay?: number;
      provider?: string;
    };
  };
  facets: SearchFacetsConfig;
  layoutInputs: SearchLayoutInput[];
}

import {
  InputCheckboxData,
  InputLinkData,
  InputTextData,
  InputSelectData,
  FacetHeaderData,
} from '@n7-frontend/components';

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
  type: 'text' | 'checkbox' | 'select' | 'link';
  data: InputCheckboxData | InputLinkData | InputSelectData | InputTextData;
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
    id: string;
    provider?: string;
    delay?: number;
  };
  facets: SearchFacetsConfig;
  layoutInputs: SearchLayoutInput[];
}

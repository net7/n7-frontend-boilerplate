import {
  InputCheckboxData,
  InputLinkData,
  InputTextData,
  InputSelectData,
  FacetHeaderData,
  MapData,
  HistogramRangeData,
} from '@net7/components';

export interface MrInputSchema {
  /** allowed schema value types */
  valueType: 'string' | 'number' | 'boolean';
  /** input has multiple values? */
  multiple?: boolean;
}

export interface MrInputHeaderData {
  /** id (unique) used with prefix header-{id} */
  id: string;
  data: FacetHeaderData;
  /** changed listener delay (counter) */
  delay?: number;
}

export interface MrSearchLayoutInput {
  /** id (unique) */
  id: string;
  /** input schema */
  schema: MrInputSchema;
  /** input change url params? */
  queryParam?: boolean;
  /** default input value */
  value?: string | string[] | boolean | null;
}

export interface MrSearchFacetsInput {
  /** id (unique) */
  id: string;
  /** input schema */
  schema: MrInputSchema;
  /** input change url params? */
  queryParam?: boolean;
  /** changed listener delay */
  delay?: number;
  /** allowed value types */
  value?: string | string[] | boolean | null;
  /** facet has a request for initial values */
  initialize?: boolean;
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
  /** how many facet links to show (paginated results)  */
  limit?: number;
}

export interface MrSearchInputMap extends MrSearchFacetsInput {
  type: 'map';
  data: MapData;
}

export interface MrSearchInputHistogram extends MrSearchFacetsInput {
  type: 'histogram';
  data: HistogramRangeData;
}

export interface MrSearchFacetsSection {
  /** Section id (must be unique) */
  id: string;
  /** Section header */
  header?: MrInputHeaderData;
  /** Section inputs (allowed types: text, checkbox, select, link) */
  inputs: (
    MrSearchInputCheckbox
    | MrSearchInputHistogram
    | MrSearchInputLink
    | MrSearchInputMap
    | MrSearchInputSelect
    | MrSearchInputText
  )[];
  /** Section aditional css classes */
  classes?: string;
}

export interface MrSearchFacetsConfig {
  sections: MrSearchFacetsSection[];
  /** aditional css classes */
  classes?: string;
}

export interface MrSearchConfig {
  request: {
    results: {
      /** results request id */
      id: string;
      /** request delay on facets change */
      delay?: number;
      /** results communication provider id */
      provider?: string;
    };
    facets: {
      /** facets request id */
      id: string;
      /** request delay on facets change */
      delay?: number;
      /** facets communication provider id */
      provider?: string;
    };
  };
  facets: MrSearchFacetsConfig;
  layoutInputs: MrSearchLayoutInput[];
}

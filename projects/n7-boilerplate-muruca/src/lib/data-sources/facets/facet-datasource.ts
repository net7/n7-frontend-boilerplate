type VALUE = string
  | string[]
  | number
  | number[]
  | boolean
  | null;

export interface FacetDataSource {
  id: string;
  value: VALUE;
  setValue: (value: VALUE, update?: boolean) => void;
  getValue: () => VALUE;
  clear: () => void;
}

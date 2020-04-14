type VALUE = string | string[] | boolean | null;

export interface FacetDataSource {
  id: string;
  value: VALUE;
  setValue: (value: VALUE) => void;
  getValue: () => VALUE;
  clear?: () => void;
}

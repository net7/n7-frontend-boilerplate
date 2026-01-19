// Metadata input
interface Metadata {
  label?: string;
  value?: string | Metadata[][];
  anchorId?: string;
}
interface GroupMetadata {
  title?: string;
  items: Metadata[];
}
interface GroupOptions {
  text?: string,
  label?: string,
  payload?: string | number,
  isOpen?: boolean,
  showHeader?: boolean,
  iconRight?: string,
  iconLeft?: string
}
export interface GroupObject {
  title?: string;
  group: GroupMetadata[];
  groupId?: string | number;
  options?: GroupOptions
}

// Metadata output
interface Readmore {
  height: number;
  labels: {
    less: string;
    more: string;
  }
}
interface SubGroup {
  groupReadmore: any;
  items: Metadata[]
}
interface GroupElement {
  classes: string;
  title: string;
  groupReadmore: any;
  readmore: Readmore;
  group: SubGroup[]
}
export interface MetadataOutput {
  group: {
    group: GroupElement[]
  }[]
}

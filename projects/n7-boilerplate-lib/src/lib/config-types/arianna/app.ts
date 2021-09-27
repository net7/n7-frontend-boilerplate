export type ConfigAriannaKeys = {
  [configKey: string]: {
    /** config key color */
    color: {
      hex: string;
      rgb: [number, number, number];
    };
    /** config key label */
    label: string;
    /** config key icon */
    icon?: string;
    /** config key singular label */
    'singular-label'?: string;
    /** config key search input placeholder */
    'input-placeholder'?: string;
    /** config key advanced search metadata group */
    'main-metadata'?: string;
    /** config key class name */
    'class-name'?: string;
    /** config key aditional sub-keys config  */
    classifications?: {
      [key: string]: {
        icon: string;
      };
    };
  };
};

export type ConfigAriannaItemPreview = {
  /** response payload path */
  image: string;
  /** item title */
  title: {
    /** response payload path */
    data: string;
    /** title characters limit */
    maxLength?: number;
  };
  /** item description */
  text?: {
    /** response payload path */
    data: string;
    /** text characters limit */
    maxLength?: number;
  };
  /** item metadata */
  metadata: {
    info: {
      /** metadata keys to show */
      selection: {
        key: string;
      }[];
      /** response payload path */
      data: string;
      /** response payload path */
      value: string;
      /** response payload path */
      label: string;
      /** custom metadata label */
      customLabel: string;
    };
    toe: {
      /** response payload path */
      data: string;
      /** response payload path */
      value: string;
      /** metadata icon */
      icon: string;
    };
    breadcrumbs: {
      /** response payload path */
      data: string;
      /** response payload path */
      label: string;
      /** bredcrumb click payload */
      payload: string;
    };
  };
  /** click payload */
  payload: string;
  /** how many pagination links */
  paginationLimit: number;
};

type FontWeight = number | 'normal' | 'bold' | 'bolder' | 'lighter' | 'initial' | 'inherit';

export type ConfigAriannaBubbleChart = {
  /** fonts config */
  fontRendering: {
    label: {
      family: string;
      weight: FontWeight;
    };
    counter: {
      family: string;
      weight: FontWeight;
    };
  };
  /** how many bubbles */
  bubbleLimit: number;
  /** animation change transition in ms */
  transition: number;
  /** random order */
  shuffle: true;
};

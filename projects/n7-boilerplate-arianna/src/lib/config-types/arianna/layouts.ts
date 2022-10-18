/* eslint-disable @typescript-eslint/no-empty-interface */
import { HeroData, ItemPreviewData } from '@net7/components';

interface HomeHeroData extends Omit<HeroData, 'input'> {
  /** advanced search fallback text */
  fallback?: string;
  /** hero text input */
  input?: {
    placeholder?: string;
    icon?: string;
    payload?: any;
  };
}

export interface ConfigAriannaHomeLayout {
  /** home top hero */
  'top-hero'?: HomeHeroData;
  /** home bottom hero */
  'bottom-hero'?: HomeHeroData;
  /** home external links */
  'outer-links'?: {
    title?: string;
    description?: string;
    test: ItemPreviewData[];
  };
  /** facets wrapper autocomplete results limit */
  'results-limit': number;
  /** facets wrapper autocomplete item length */
  'max-item-length': number;
  /** facets wrapper autocomplete fallback text */
  'autocomplete-fallback': string;
  /** item preview (right sidebar) fallback text */
  'linked-objects-fallback': string;
}

type StringLimitConfig = {
  /** text limit */
  maxLength?: number;
  /** ellipsis string */
  char?: string;
}

export interface ConfigAriannaCollectionLayout {
  /** page header */
  header: StringLimitConfig;
  /** page description */
  description: StringLimitConfig;
  /** item watermark path */
  watermark?: string;
  /** collection item */
  item: {
    /** item title */
    title: StringLimitConfig;
    /** item description */
    description: StringLimitConfig;
  };
}

export interface ConfigAriannaEntitaLayout {
  /** overview tab */
  overview: {
    /** allowed metadata keys */
    informazioni: string[];
    /** bubble chart size */
    smallChartSize: number;
  };
  /** no info fallback text */
  fallback: string;
  /** DEPRECATED: entities request limit */
  entitiesQuerySize: number;
  /** info tab allowed metadata keys */
  'metadata-to-show': string[];
}

export interface ConfigAriannaMapLayout {
  // nothing here!
}

export interface ConfigAriannaTimelineLayout {
  /** Options for the timeline component */
  timeline: {
    /** Forces the timeline to render all dates as single moments */
    disableEndDates: boolean;
  };
}

export interface ConfigAriannaSchedaLayout {
  /** no item information fallback text */
  'empty-html': string;
  /** initial page text no item selected */
  'empty-label': string;
  /** default text for external links|resources */
  'external-url-text': string;
  /** related entities section */
  'related-entities': {
    /** related entities section title */
    title: string;
  };
  /** related items section */
  'related-items': {
    /** related items section title */
    title: string;
    /** how many related items */
    'max-related-items': number;
  };
  /** extended tree section */
  'extended-tree'?: {
    /** extended tree section title */
    title: string;
    /** extended tree search input */
    search: {
      placeholder: string;
    }
    /** extended tree lite version? */
    lite?: boolean;
  };
  /** image viewer navigation */
  'image-viewer-nav'?: {
    enabled: boolean;
    label: string;
    buttonText: string;
  };
  /** title prev/next navigation */
  'title-nav'?: {
    enabled: boolean;
  };
  /** metadata section */
  metadata: {
    /** metadata section title */
    title: string;
  };
  /** tree config */
  tree: {
    /** tree lite version? */
    lite?: boolean;
    /** tree sidebar collapsed? */
    collapsedByDefault?: boolean;
    /** icon expand class */
    'icon-expand': string;
    /** icon collapse class */
    'icon-collapse': string;
    /** default image icon class */
    'icon-image': string;
    /** types icon map */
    'icon-map': {
      /** typeid => icon class */
      [typeKey: string]: string;
    }[];
  };
  /** image viewer options */
  'image-viewer'?: {
    /** is mouse context menu (right click) disabled? */
    'context-menu'?: boolean;
  };
  /** pdf viewer options */
  'pdf-viewer'?: {
    /** pdf lib (ngx-extended-pdf-viewer) options */
    libOptions?: {
      showToolbar?: boolean;
      showSidebarButton?: boolean;
      showFindButton?: boolean;
      showPagingButtons?: boolean;
      showZoomButtons?: boolean;
      showPresentationModeButton?: boolean;
      showOpenFileButton?: boolean;
      showPrintButton?: boolean;
      showDownloadButton?: boolean;
      showBookmarkButton?: boolean;
      showSecondaryToolbarButton?: boolean;
      showRotateButton?: boolean;
      showHandToolButton?: boolean;
      showScrollingButton?: boolean;
      showSpreadButton?: boolean;
      showPropertiesButton?: boolean;
    };
  };
  /** allowed metadata */
  'metadata-to-show': {
    /** type key => Array<metadata keys> */
    [type: string]: string[];
  };
}

export interface ConfigAriannaSearchLayout {
  /** page title */
  title: string;
  /** results labels: 0 items | 1 item | n items */
  results: [string, string, string];
  /** allowed entities keys */
  enabledEntities: string[];
  /** no results fallback text */
  fallback: string;
}

export interface ConfigAriannaGalleryLayout extends ConfigAriannaSearchLayout {
  // nothing here
}

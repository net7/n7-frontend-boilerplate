import { LibOptions } from '@n7-frontend/components';
import { MrSearchConfig } from '../../interfaces/search.interface';
import {
  ConfigMurucaBreadcrumbsSection,
  ConfigMurucaCollectionSection,
  ConfigMurucaContentSection,
  ConfigMurucaGallerySection,
  ConfigMurucaHeroSection,
  ConfigMurucaImageViewerSection,
  ConfigMurucaInfoBoxSection,
  ConfigMurucaItemPreviewSection,
  ConfigMurucaMetadataSection,
  ConfigMurucaSliderSection,
  ConfigMurucaTabsSection,
  ConfigMurucaTextViewerSection,
  ConfigMurucaTitleSection
} from './sections';

export interface ConfigMurucaLayout {
  /** page title */
  title: string;
  /** aditional body classes */
  bodyClasses?: string;
}

export interface ConfigMurucaHomeLayout extends ConfigMurucaLayout {
  /** layout sections */
  sections: (
    ConfigMurucaSliderSection
    | ConfigMurucaContentSection
    | ConfigMurucaHeroSection
    | ConfigMurucaCollectionSection
  )[];
}

export interface ConfigMurucaResourceLayout extends ConfigMurucaLayout {
  /** resource type (used by resource modal) */
  type: string;
  /** layout sections (top | content) */
  sections: {
    [key in 'top' | 'content']: (
      ConfigMurucaTabsSection
      | ConfigMurucaTitleSection
      | ConfigMurucaImageViewerSection
      | ConfigMurucaMetadataSection
      | ConfigMurucaCollectionSection
      | ConfigMurucaItemPreviewSection
      | ConfigMurucaTextViewerSection
      | ConfigMurucaInfoBoxSection
      | ConfigMurucaBreadcrumbsSection
    )[];
  };
}

export interface ConfigMurucaItineraryLayout extends ConfigMurucaLayout {
  /** layout sections */
  sections: (
    ConfigMurucaMetadataSection
    | ConfigMurucaCollectionSection
    | ConfigMurucaGallerySection
  )[];
}

export interface ConfigMurucaTimelineLayout extends ConfigMurucaLayout {
  /** map header title */
  mapHeader: string;
  /** timeline library options */
  libOptions: LibOptions;
}

type SearchSortConfig = {
  /** select label */
  label?: string;
  /** select options */
  options: {
    value: string;
    label: string;
    selected?: boolean;
    disabled?: boolean;
  }[];
}

type SearchPaginationConfig = {
  /** results per page */
  limit: number;
  /** select options */
  options: number[];
  /** select label */
  selectLabel?: string;
}

type SearchItemPreviewConfig = {
  /** aditional css classes */
  classes: string;
}

type SearchFallbackConfig = {
  /** description (no results | error) */
  text: string;
  /** button text */
  button: string;
}

export interface ConfigMurucaSearchLayout extends ConfigMurucaLayout {
  /** search id (unique) used by search service */
  searchId: string;
  /** search config */
  searchConfig: MrSearchConfig;
  /** results resource path (route) */
  resourcePath: string;
  /** total results text */
  totalResultsText: string;
  /** facets sidebar title */
  facetsTitle?: string;
  /** filters title, on top of results */
  filtersTitle?: string;
  /** item preview is advanced? */
  advancedResults?: boolean;
  /** facets column width (%) */
  facetsWidthPercentage?: number;
  /** page description */
  description?: {
    id: string;
    buttonText: string;
    linkText: string;
  };
  /** results css grid 1, 2, 3 */
  grid?: number;
  sort?: SearchSortConfig;
  pagination: SearchPaginationConfig;
  itemPreview?: SearchItemPreviewConfig;
  disableScroll?: boolean;
  fallback: SearchFallbackConfig;
  ko: SearchFallbackConfig;
}

export interface ConfigMurucaLayoutPosts extends ConfigMurucaLayout {
  /** id (unique) used by search service */
  searchId: string;
  /** results resource path (link) */
  resourcePath: string;
  /** total posts text */
  totalResultsText: string;
  /** results css grid 1, 2, 3 */
  grid?: number;
  sort?: SearchSortConfig;
  pagination: SearchPaginationConfig;
  itemPreview?: SearchItemPreviewConfig;
  fallback: SearchFallbackConfig;
  ko: SearchFallbackConfig;
}

export interface ConfigMurucaLayoutAdvancedResults extends ConfigMurucaLayout {
  /** id (unique) used by search service */
  searchId: string;
  /** results resource path (link) */
  resourcePath: string;
  /** total results text */
  totalResultsText: string;
  /** filters to show */
  filters: {
    /** filters title */
    title: string;
    /**
     * filters labels map: filterId => label
     * filter must be in this map to be shown on page
     */
    labels: {
      [filterId: string]: string;
    };
  };
  /** results css grid 1, 2, 3 */
  grid?: number;
  sort?: SearchSortConfig;
  pagination: SearchPaginationConfig;
  itemPreview?: SearchItemPreviewConfig;
  fallback: SearchFallbackConfig;
  ko: SearchFallbackConfig;
}

export interface ConfigMurucaLayoutMap extends ConfigMurucaLayout {
  /** page default description */
  defaultText: string;
}

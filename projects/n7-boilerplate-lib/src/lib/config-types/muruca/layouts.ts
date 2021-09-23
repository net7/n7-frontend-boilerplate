import { LibOptions } from '@n7-frontend/components';
import { MrSearchConfig } from '../../muruca/interfaces/search.interface';
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
  title: string;
  bodyClasses?: string;
}

export interface ConfigMurucaHomeLayout extends ConfigMurucaLayout {
    sections: (
      ConfigMurucaSliderSection
      | ConfigMurucaContentSection
      | ConfigMurucaHeroSection
      | ConfigMurucaCollectionSection
    )[];
}

export interface ConfigMurucaResourceLayout extends ConfigMurucaLayout {
  type: string;
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
  sections: (
    ConfigMurucaMetadataSection
    | ConfigMurucaCollectionSection
    | ConfigMurucaGallerySection
  )[];
}

export interface ConfigMurucaTimelineLayout extends ConfigMurucaLayout {
  mapHeader: string;
  libOptions: LibOptions;
}

type SearchSortConfig = {
  label?: string;
  options: Array<{
    value: string;
    label: string;
    selected?: boolean;
    disabled?: boolean;
  }>;
}

type SearchPaginationConfig = {
  limit: number;
  options: number[];
  selectLabel?: string;
}

type SearchItemPreviewConfig = {
  classes: string;
}

type SearchButtonConfig = {
  text: string;
  button: string;
}

export interface ConfigMurucaSearchLayout extends ConfigMurucaLayout {
  searchId: string;
  searchConfig: MrSearchConfig;
  resourcePath: string;
  totalResultsText: string;
  facetsTitle?: string;
  filtersTitle?: string;
  advancedResults?: boolean;
  description?: {
    id: string;
    buttonText: string;
    linkText: string;
  };
  grid?: number;
  sort?: SearchSortConfig;
  pagination: SearchPaginationConfig;
  itemPreview?: SearchItemPreviewConfig;
  fallback: SearchButtonConfig;
  ko: SearchButtonConfig;
}

export interface ConfigMurucaLayoutPosts extends ConfigMurucaLayout {
  searchId: string;
  resourcePath: string;
  totalResultsText: string;
  grid?: number;
  sort?: SearchSortConfig;
  pagination: SearchPaginationConfig;
  itemPreview?: SearchItemPreviewConfig;
  fallback: SearchButtonConfig;
  ko: SearchButtonConfig;
}

export interface ConfigMurucaLayoutAdvancedResults extends ConfigMurucaLayout {
  searchId: string;
  resourcePath: string;
  totalResultsText: string;
  filters: {
    title: string;
    labels: {
      [filterId: string]: string;
    };
  };
  grid?: number;
  sort?: SearchSortConfig;
  pagination: SearchPaginationConfig;
  itemPreview?: SearchItemPreviewConfig;
  fallback: SearchButtonConfig;
  ko: SearchButtonConfig;
}

export interface ConfigMurucaLayoutMap extends ConfigMurucaLayout {
  defaultText: string;
}

import { MrSearchConfig } from '../../muruca/interfaces/search.interface';
import {
  ConfigMurucaBreadcrumbsSection,
  ConfigMurucaCollectionSection,
  ConfigMurucaContentSection,
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
  sort?: {
    label?: string;
    options: Array<{
      value: string;
      label: string;
      selected?: boolean;
      disabled?: boolean;
    }>;
  };
  pagination: {
    limit: number;
    options: number[];
    selectLabel?: string;
  };
  itemPreview?: {
    classes: string;
  };
  fallback: {
    text: string;
    button: string;
  };
  ko: {
    text: string;
    button: string;
  };
}

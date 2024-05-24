import { ReadMoreData } from '../../components/read-more/read-more';

export interface ConfigMurucaSection {
  /** id (unique) */
  id: string;
  /** section title */
  title?: string;
  /** css grid value 1, 2, 3 */
  grid?: number;
  /** section options */
  options?: object;
}

export interface ConfigMurucaSliderSection extends ConfigMurucaSection {
  type: 'slider';
}

export interface ConfigMurucaContentSection extends ConfigMurucaSection {
  type: 'content';
}

export interface ConfigMurucaHeroSection extends ConfigMurucaSection {
  type: 'hero';
  options?: {
    /** aditional css classes */
    classes?: string;
    /** has background? */
    background?: boolean;
  };
}

export interface ConfigMurucaDownloadPDFSection extends ConfigMurucaSection {
  type: 'download-pdf';
}

export interface ConfigMurucaCollectionSection extends ConfigMurucaSection {
  type: 'collection';
  options?: {
    /** aditional css classes */
    classes?: string;
    itemPreview?: {
      /** text character limit */
      limit?: number;
      /** no html tags? */
      striptags?: boolean;
      /** link target <a target="{target}">  */
      linkTarget?: '_blank' | '_self' | '_parent' | '_top';
    };
  };
}

export interface ConfigMurucaBreadcrumbsSection extends ConfigMurucaSection {
  type: 'breadcrumbs';
}

export interface ConfigMurucaInfoBoxSection extends ConfigMurucaSection {
  type: 'info';
}

export interface ConfigMurucaTextViewerSection extends ConfigMurucaSection {
  type: 'text';
}

export interface ConfigMurucaTitleSection extends ConfigMurucaSection {
  type: 'title';
}

export interface ConfigMurucaImageViewerSection extends ConfigMurucaSection {
  type: 'viewer';
  options?: {
    /** has image viewer tools? */
    tools: boolean;
  };
}

export interface ConfigMurucaTabsSection extends ConfigMurucaSection {
  type: 'tabs';
}

export interface ConfigMurucaItemPreviewSection extends ConfigMurucaSection {
  type: 'preview';
  options?: {
    /** aditional css classes */
    classes?: string;
    itemPreview?: {
      /** text character limit */
      limit?: number;
      /** no html tags? */
      striptags?: boolean;
    };
  };
}

export interface ConfigMurucaMetadataSection extends ConfigMurucaSection {
  type: 'metadata';
  /** read more toggle data */
  readmore?: ReadMoreData;
  options?: {
    /** hide metadata labels? */
    hideLabels: boolean;
  };
}

export interface ConfigMurucaGallerySection extends ConfigMurucaSection {
  type: 'gallery';
}

export interface ConfigMurucaMetadataDynamicSection extends ConfigMurucaSection {
  type: 'metadata-dynamic'
  options?: {
    accordion: boolean,
    dynamic: boolean
  }
}

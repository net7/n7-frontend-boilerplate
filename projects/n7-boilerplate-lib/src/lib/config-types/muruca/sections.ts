export interface ConfigMurucaSection {
  id: string;
  title?: string;
  grid?: number;
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
    classes?: string;
    background?: boolean;
  };
}

export interface ConfigMurucaCollectionSection extends ConfigMurucaSection {
  type: 'collection';
  options?: {
    classes?: string;
    itemPreview?: {
      limit?: number;
      striptags?: boolean;
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
    tools: boolean;
  };
}

export interface ConfigMurucaTabsSection extends ConfigMurucaSection {
  type: 'tabs';
}

export interface ConfigMurucaItemPreviewSection extends ConfigMurucaSection {
  type: 'preview';
  options?: {
    classes?: string;
    itemPreview?: {
      limit?: number;
      striptags?: boolean;
    };
  };
}

export interface ConfigMurucaMetadataSection extends ConfigMurucaSection {
  type: 'metadata';
  options?: {
    hideLabels: boolean;
  };
}

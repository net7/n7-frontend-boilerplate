export interface CollectionItem {
  image?: string;
  link?: string;
  text?: string;
  payload?: {
    action: string;
    id: number;
    type: string;
  };
  title: string;
}

export interface GalleryItem {
  id: number;
  image: string;
  thumbnail: string;
  title: string;
}

export interface CollectionData {
  header: {
    title: string;
  };
  items: (CollectionItem | undefined)[];
}

export interface GetResourceResponse {
  sections: {
    'collection-bibliography': CollectionData;
    'collection-places': CollectionData;
    'collection-witnesses': CollectionData;
    'collection-works': CollectionData;
    'collection-books': CollectionData;
    gallery?: GalleryItem[] | [];
    header: {
      title: string;
      content?: string;
    };
  };
  title: string;
}

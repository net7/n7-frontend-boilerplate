export interface GetCollectionResponse {
  items: CollectionItem[];
  title: string;
  total: number;
}

export interface GetCollectionParams {
  id: string;
  itemPagination?: {
    limit: number;
    offset: number;
  };
}

export type CollectionItem = {
  /** title for the url slug section */
  title: nullString;
  content: nullString;
  /** color code for the background color */
  background: nullString;
  /** background-image url */
  image: nullString;
  /** link url; when null the url should be constructed from type, id, title */
  url: nullString;
  a4vId: nullString;
  /** type of resource that the item-preview refers to (useful for building the url) */
  type: nullString;
}

type nullString = string | null;

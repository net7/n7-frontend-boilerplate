export interface GetCollectionResponse {
  title: string;
  items: CollectionItem[];
}

export interface GetCollectionParams {
  id: number;
  itemPagination: {
    limit: number;
    offset: number;
  };
}

type CollectionItem = {
  title: nullString; // use title for slug in url
  content: nullString;
  background: nullString; // codice colore
  image: nullString; // url dell'immagine
  url: nullString; // se url è null bisogna costruire la stringa
  a4vId: nullString;
  type: nullString; // la url del click si basa sul type
}

// url = type / id / title

type nullString = string | null;

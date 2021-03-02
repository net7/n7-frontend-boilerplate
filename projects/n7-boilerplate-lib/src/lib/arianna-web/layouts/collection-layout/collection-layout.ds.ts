import { InnerTitleData, ItemPreviewData } from '@n7-frontend/components';
import { LayoutDataSource } from '@n7-frontend/core';

export class AwCollectionLayoutDS extends LayoutDataSource {
  private communication;

  innerTitleData: InnerTitleData = {
    title: { main: { text: 'Articoli recenti' } },
  }

  collectionData: ItemPreviewData[] = [{
    title: '1 - Casa a S. Piero a Ponti - 1964 - Tipo A - Veduta',
    classes: 'is-compact',
    image: 'https://placeimg.com/640/480/any',
  }, {
    title: '1953 - Settembre - Bari - Padiglione dell\'I.N.A alla Fiera del Levante (1953)',
    classes: 'is-compact',
    image: 'https://placeimg.com/640/480/any',
  }, {
    title: '1956 - Cagliari - cattedrale (1956)',
    classes: 'is-compact',
    image: 'https://placeimg.com/640/480/any',
  }, {
    title: '4 aprile 1948 - Lucca - San Martino - Tomba di Ilaria del Carretto - (J. della Quercia) (4 aprile 1948)',
    classes: 'is-compact',
    image: 'https://placeimg.com/640/480/any',
  }, {
    title: '5 - Casa a S. Piero a Ponti - Tipo A - Retro 1:50 ([1964])',
    classes: 'is-compact',
    image: 'https://placeimg.com/640/480/any',
  }, {
    title: '1 - Casa a S. Piero a Ponti - 1964 - Tipo A  Veduta (1964)',
    classes: 'is-compact',
    image: 'https://placeimg.com/640/480/any',
  }]

  onInit(payload) {
    this.communication = payload.communication;
  }
}

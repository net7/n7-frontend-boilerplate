import { Observable, of } from 'rxjs';
import { ItemPreviewData } from '@n7-frontend/components';

type response = {
  results: ItemPreviewData[];
  totalCount: number;
}

const mock = [{
  title: '1 - Casa a S. Piero a Ponti - 1964 - Tipo A - Veduta',
  classes: 'is-overlay has-image',
  image: 'https://placeimg.com/640/480/any',
}, {
  title: '1953 - Settembre - Bari - Padiglione dell\'I.N.A alla Fiera del Levante (1953)',
  classes: 'is-overlay has-image',
  image: 'https://placeimg.com/640/480/any',
}, {
  title: '1956 - Cagliari - cattedrale (1956)',
  classes: 'is-overlay has-image',
  image: 'https://placeimg.com/640/480/any',
}, {
  title: '4 aprile 1948 - Lucca - San Martino - Tomba di Ilaria del Carretto - (J. della Quercia) (4 aprile 1948)',
  classes: 'is-overlay has-image',
  image: 'https://placeimg.com/640/480/any',
}, {
  title: '5 - Casa a S. Piero a Ponti - Tipo A - Retro 1:50 ([1964])',
  classes: 'is-overlay has-image',
  image: 'https://placeimg.com/640/480/any',
}, {
  title: '1 - Casa a S. Piero a Ponti - 1964 - Tipo A  Veduta (1964)',
  classes: 'is-overlay has-image',
  image: 'https://placeimg.com/640/480/any',
}];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCollection = ({ offset, limit }): Observable<response> => of({
  results: mock.slice(0, limit),
  totalCount: 120
});

export default getCollection;

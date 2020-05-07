import { CAROUSEL_MOCK } from '@n7-frontend/components';

export default {
  'slider-1': CAROUSEL_MOCK,
  'collection-1': {
    header: {
      title: 'Le mappe',
      subtitle: 'Una selezione di alcune mappe di Totus Mundus.',
      button: {
        text: 'Visita il catalogo',
        link: '/catalogo'
      }
    },
    items: [
      {
        image: 'https://i.imgur.com/8bNcgR6.png',
        title: 'Unattributed version',
        text: 'A japanese colored version',
        metadata: [{
          classes: 'metadata',
          items: [
            { label: 'Artista', value: 'Massimo Berruti' },
            { label: 'Tecnica', value: 'Fotografia' },
            { label: 'Galleria', value: 'Galleria Tonelli' },
          ]
        }]
      }, {
        image: 'https://i.imgur.com/52UFqca.png',
        title: 'Yudi Shanhai Quantu',
        text: 'Complete Map of all mountains and seas',
      }, {
        image: 'https://i.imgur.com/sLu7u2v.png',
        title: 'Reconstruction of D\'Elia\'s map',
        text: 'A digital collage of the map portions from Pasquale D\'Elia "mappamondo"',
        metadata: [{
          classes: 'metadata',
          items: [
            { label: 'Artista', value: 'Massimo Berruti' },
            { label: 'Tecnica', value: 'Fotografia' },
            { label: 'Galleria', value: 'Galleria Tonelli' },
          ]
        }]
      }, {
        image: 'https://i.imgur.com/8bNcgR6.png',
        title: 'Unattributed version',
        text: 'A japanese colored version',
      }
    ]
  },
  'hero-1': {
    title: 'L\'archivio',
    text: 'Il progetto Unus sufficit orbis presenta infromazioni e dati relativi al lavoro e la vita del gesuita Matteo Ricci: le sue mappe che ha creato e le persone con cui ha collaborato.',
    button: {
      title: '',
      text: 'Vai alle opere',
      anchor: {
        href: '/button-url',
        target: '_blank'
      }
    },
    image: 'https://i.imgur.com/VHTbVbm.png'
  },
  'collection-2': {
    header: {
      title: 'I percorsi',
      subtitle: 'Visita il mondo di Totus Mundus con una serie di percorsi per te.',
      button: {
        text: 'Visita il catalogo',
        link: '/catalogo'
      }
    },
    items: [
      {
        image: 'https://i.imgur.com/8bNcgR6.png',
        title: 'Unattributed version',
        text: 'A japanese colored version',
      }, {
        image: 'https://i.imgur.com/52UFqca.png',
        title: 'Yudi Shanhai Quantu',
        text: 'Complete Map of all mountains and seas',
      }, {
        image: 'https://i.imgur.com/sLu7u2v.png',
        title: 'Reconstruction of D\'Elia\'s map',
        text: 'A digital collage of the map portions from Pasquale D\'Elia "mappamondo"',
      }
    ]
  }
};

export default {
  'title-1': {
    title: 'Imago primi saeculi Societatis lesu : a prouincia Flandro-Belgica eiusdem Societatis repraesentata',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
    button: {
      title: '',
      text: 'Vai alle opere',
      anchor: {
        href: '/button-url',
        target: '_blank'
      }
    },
  },
  'title-2': {
    title: 'Kunyu Wanguo Quantu',
    subtitle: 'The earliest known Chinese world map with the style of European maps',
  },
  'viewer-1': {
    images: [
      { type: 'image', url: 'https://i.imgur.com/Zb9g5LK.png' },
      { type: 'image', url: 'https://i.imgur.com/ODmWj8U.png' },
      { type: 'image', url: 'https://i.imgur.com/yTVXoSe.png' },
    ],
    thumbs: [
      { url: 'https://i.imgur.com/Zb9g5LK.png', classes: 'is-active' },
      { url: 'https://i.imgur.com/ODmWj8U.png' },
      { url: 'https://i.imgur.com/yTVXoSe.png' },
    ],
    viewerId: 'seadragon-viewer',
    libOptions: {
      /* SHOW GROUP */
      showNavigator: false, // shows the mini-map
      autoHideControls: false,

      /* SHOW BUTTONS */
      showRotationControl: false,
      showSequenceControl: true,
      showHomeControl: true,
      showZoomControl: true,

      /* SEQUENCE */
      sequenceMode: true, // allows having multiple images (as in array of images + zoomed image)
      showReferenceStrip: true, // shows the images array (default: horizontally)

      navigationControlAnchor: 'TOP_RIGHT',
    },
    _setViewer(viewer) { return viewer; }
  },
  'preview-2': {
    title: 'Collezione di appartenenza',
    text: 'Asia Mappe dal XVII al XVII secolo',
    image: 'https://i.imgur.com/2k38MUx.png',
    classes: 'is-fullwidth'
  },
  'metadata-1': {
    group: [{
      title: 'Metadati',
      items: [
        { label: 'Digitalizzazione', value: '<a href="https://gate.unigre.it/mediawiki/index.php">https://gate.unigre.it/mediawiki/index.php</a>' },
        { label: 'Nome/i', value: '<a href="https://gate.unigre.it/mediawiki/index.php">Matteo Ricci, Li Zhizao</a>' },
        { label: 'Titolo', value: 'Kunyu Wanguo Quantu' },
        { label: 'Luogo di stampa', value: 'Beijing, China' },
        { label: 'Stampatore', value: 'Zhang Wentao of Hangzhou' },
        { label: 'Anno', value: '1602' },
        { label: 'Lingua', value: 'Cinese' },
        { label: 'Contenuto in', value: 'Coelum XXIV (1958) pp. 41-50' },
        { label: 'Livello bibliografico', value: 'Paper in journal' },
        { label: 'Descrizione catalogo', value: 'Cinese' },
        { label: 'Riferimento archivio', value: 'APUG, Fondo Pasquale D\'Elia' },
        { label: 'Parole chiave', value: '1602' },
        { label: 'Citato in', value: 'Zhang Wentao of Hangzhou' },
        { label: 'Descrizione fisica', value: 'Beijing, China' },
        { label: 'Misure', value: 'Scale circa 1:12,500,000' },
      ]
    }]
  },
  'metadata-2': {
    group: [{
      title: 'Dimensioni',
      items: [{
        label: '', value: '<img src="https://i.imgur.com/6X6AtRs.png">'
      }, {
        label: '', value: 'The map is composed by 6 panels. Each panel has a size of 167 x 61.5 cm. Overall the size of the map is 167.5 x 371.2 centimeters.'
      }]
    }]
  },
  'collection-2': {
    // header: {
    //   title: 'Bibliografia',
    //   subtitle: 'Visita il mondo di Totus Mundus con una serie di percorsi per te.',
    //   button: {
    //     text: 'Visita il catalogo',
    //     link: '/catalogo'
    //   }
    // },
    items: [
      {
        image: 'https://i.imgur.com/31D4TpW.png',
        title: 'Relazione del viaggio da Parigi a Shanghai attraverso la Siberia. Zikawei, 5 XII 1912',
        text: 'A japanese colored version',
        metadata: [{
          items: [
            { label: 'Autore', value: 'D\'Elia, Pasquale' },
            { label: 'Lingua', value: 'Zho' },
            { label: 'Entry ID', value: 'Bibliography: Pasquale D\'Elia Bibliography 0001' },
            { label: 'Livello bibliografico', value: 'Paper in journal' },
            { label: 'Anno', value: '1913' },
          ]
        }]
      },
      {
        image: 'https://i.imgur.com/31D4TpW.png',
        title: 'Relazione del viaggio da Parigi a Shanghai attraverso la Siberia. Zikawei, 5 XII 1912',
        text: 'A japanese colored version',
        metadata: [{
          items: [
            { label: 'Autore', value: 'D\'Elia, Pasquale' },
            { label: 'Lingua', value: 'Zho' },
            { label: 'Entry ID', value: 'Bibliography: Pasquale D\'Elia Bibliography 0001' },
            { label: 'Livello bibliografico', value: 'Paper in journal' },
            { label: 'Anno', value: '1913' },
          ]
        }]
      },
      {
        image: 'https://i.imgur.com/31D4TpW.png',
        title: 'Relazione del viaggio da Parigi a Shanghai attraverso la Siberia. Zikawei, 5 XII 1912',
        text: 'A japanese colored version',
        metadata: [{
          items: [
            { label: 'Autore', value: 'D\'Elia, Pasquale' },
            { label: 'Lingua', value: 'Zho' },
            { label: 'Entry ID', value: 'Bibliography: Pasquale D\'Elia Bibliography 0001' },
            { label: 'Livello bibliografico', value: 'Paper in journal' },
            { label: 'Anno', value: '1913' },
          ]
        }]
      },
    ]
  },
  'metadata-3': {
    group: [{
      title: 'Descrizione',
      items: [{
        label: '',
        value: 'Kunyu Wanguo Quantu (Chinese: pinyin: Künyü Wångu6 Quåntå; literally: "A Map of the Myriad Countries of the World"; Italian: Carta Geografica Completa di tutti i Regni del Mondo, "Complete Geographical Map of all the Kingdoms of the World"), printed in China at the request of the Wanli Emperor during 1602 by the Italian Catholic missionary Matteo Ricci and Chinese collaborators, Mandarin Zhong Wentao and the technical translator, Li Zhizao, is the earliest known Chinese world map with the style of European maps. It has been referred to as the Impossible Black Tulip of Cartography, "because of its rarity, importance and exoticism". The map was crucial in expanding Chinese knowledge of the world. It was later exported to Japan and was influential there as well. Kunyu Wanguo Quantu (Chinese: pinyin: Künyü Wångu6 Quåntå; literally: "A Map of the Myriad Countries of the World"; Italian: Carta Geografica Completa di tutti i Regni del Mondo, "Complete Geographical Map of all the Kingdoms of the World").'
      }]
    }]
  },
  'collection-1': {
    items: [
      {
        title: 'Preface of Qi Guangzong',
      }, {
        title: 'Preface of Yang Jingchun',
      }, {
        title: 'Epilogue of Chen Minzhi',
      }, {
        title: 'Preface of Li Zhizao',
      }, {
        title: 'Method for observing the North pole',
      }, {
        title: 'Asia',
      }, {
        title: 'North America',
      }, {
        title: 'South America',
      }, {
        title: 'Libya (Africa)',
      }, {
        title: 'Preface of Qi Guangzong',
      }, {
        title: 'Preface of Yang Jingchun',
      }, {
        title: 'Epilogue of Chen Minzhi',
      }, {
        title: 'Preface of Li Zhizao',
      }, {
        title: 'Method for observing the North pole',
      }, {
        title: 'Asia',
      },
    ]
  }
};

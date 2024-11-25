import { ConfigAriannaSchedaLayout } from '@net7/boilerplate-arianna';

const config: ConfigAriannaSchedaLayout = {
  'empty-html': '<span>Non sono disponibili informazioni.<span>',
  'empty-label': `<h2>Benvenuto nel patrimonio archivistico dell'Archivio di Stato di Venezia</h2>
  <img src="/assets/patrimonio-text-image.jpeg"></im><p><em>moreveneto</em> ci presenta un quadro pluridimensionale dove troviamo:</p>
  <ul><li>i <strong>complessi archivistici</strong> conservati dall'Archivio di Stato di Venezia nelle sue tre sedi, tutti descritti almeno con le informazioni di base; nella maggior parte dei casi, sono disponibili anche le descrizioni delle ulteriori articolazioni subordinate (serie, sottoserie) per un totale di quasi quindicimila schede</li>
  <li><strong>le entità</strong>: organizzazioni, persone, famiglie, luoghi, che sono legate ai documenti da <strong>relazioni</strong> diverse ma esplicite. Tra queste i soggetti che hanno prodotto gli archivi.</li></ul>
  <p>Non di meno trovano spazio nel sistema gli <strong>strumenti di ricerca</strong> tradizionali (inventari, elenchi, tavole di raffronto, etc.) consultabili in formato immagine, nella loro versione otto-novecentesca, o in pdf. Alcuni nuclei documentari sono inoltre consultabili online: unità archivistiche e documentarie sono disponibili in <strong>riproduzione digitale</strong>, legate al complesso archivistico di appartenenza e descritte nelle relative schede.</p>`,
  'external-url-text': 'Visualizza',
  'related-entities': {
    title: 'Entità collegate'
  },
  'related-items': {
    title: 'Oggetti culturali simili',
    'max-related-items': 6
  },
  metadata: {
    title: 'Informazioni'
  },
  tree: {
    lite: true,
    collapsedByDefault: true,
    'icon-expand': 'n7-icon-angle-right',
    'icon-collapse': 'n7-icon-angle-down',
    'icon-image': 'n7-icon-image',
    'icon-map': [
      {
        'oc-type-foo': 'n7-icon-building'
      },
      {
        'oc-type-bar': 'n7-icon-biography'
      }
    ]
  },
  'extended-tree': {
    // lite: true,
    title: 'Oggetti culturali',
    search: {
      placeholder: 'Cerca negli oggetti culturali'
    },
    fallback: 'La tua ricerca non ha dato risultati. Prova a cambiare i parametri.',
  },
  'internal-search': {
    // lite: true,
    title: 'Cerca nelle Aggregazioni Logiche',
    search: {
      placeholder: 'Cercando...'
    },
    fallback: 'La tua ricerca non ha dato risultati. Prova a cambiare i parametri.',
  },
  'image-viewer-nav': {
    enabled: true,
    label: 'Immagine {current} di {total}',
    buttonText: 'VAI',
  },
  'title-nav': {
    enabled: true
  },
  'image-viewer': {
    'context-menu': false
  },
  'iiif-viewer': {
    libOptions: {
      window: {
        sideBarOpenByDefault: true,
        allowClose: false,
        allowMaximize: true,
        defaultSideBarPanel: 'info',
        views: [
          { key: 'single' },
          { key: 'gallery' },
        ],
      },
      workspaceControlPanel: {
        enabled: true,
      },
      id: 'mirador-container',
      useDefaultTheme: false,
      language: 'it',
      'context-menu': false,
    },
  },
  'pdf-viewer': {
    libOptions: {
      // showToolbar: true,
      // showSidebarButton: true,
      // showFindButton: true,
      // showPagingButtons: true,
      // showZoomButtons: true,
      // showPresentationModeButton: true,
      // showOpenFileButton: false,
      // showPrintButton: false,
      // showDownloadButton: false,
      // showBookmarkButton: false,
      // showSecondaryToolbarButton: true,
      // showRotateButton: false,
      // showHandToolButton: true,
      // showScrollingButton: false,
      // showSpreadButton: false,
      // showPropertiesButton: false
    }
  },
  'metadata-to-show': {
    'aggregazione-logica': [
      'estremo_remoto',
      'estremo_recente',
      'tipologia',
      'altre_denominazioni',
      'altre_denominazioni.denominazione',
      'altre_denominazioni.tipologia',
      'consistenza',
      'consistenza.quantita',
      'consistenza.unitaMisura',
      'soggettoProduttore',
      'soggettoProduttore.soggettoProduttore',
      'soggettoProduttore.label',
      'soggettoConservatore',
      'soggettoConservatore.label',
      'soggettoConservatore.soggettoConservatoreAttuale',
      'soggettoConservatore.tipoResponsabilita',
      'soggettoConservatore.parteConservata',
      'soggettoConservatore.causeAcquisizione',

      'produzione',
      'produzione.soggettoProduttore',

      'produzione.soggettoConservatoreAttuale',
      'produzione.soggettoConservatore',
      'produzione.tipoResponsabilita',
      'produzione.parteConservata',
      'produzione.causeAcquisizione',
      'descrizione_interna',
      'storia_ordinamenti',
      'stato_conservazione',
      'altra_documentazione',
      'descrizione_esterna',
      'storia_ubicazioni',
      'condizioni_consultazione_modalita',
      'condizioni_consultazione_tempi',
      'corredoRicerca',
      'corredoRicerca.tipologia',
      'corredoRicerca.riferimento',
      'corredoRicerca.descrizione'
    ],
    'oggetto-culturale': [],
    UASC: [
      'estremo_remoto',
      'estremo_recente',
      'altreSegnature',
      'altreSegnature.numerazione',
      'altreSegnature.tipologia',
      'altra_intitolazione',
      'altra_intitolazione.tipologia',
      'altra_intitolazione.intitolazione',
      'tipologiaMateriale',
      'supporto',
      'statoConservazione',
      'descrizioneContenuto',
      'autoreCommittente',
      'editore',
      'luogoEdizione',
      'dataEdizione',
      'unitaPrelievo',
      'altezza',
      'larghezza',
      'spessore',
      'consistenzaOC',
      // 'entitaRelazionata',
      'tipologiaRappresentazione',
      'stampa',
      'stadioRedazione',
      'procedimentoGrafico',
      'mediazioniGrafiche',
      'dimensioniRaffigurazioneAltezza',
      'dimensioniRaffigurazioneLarghezza',
      'lingua',
      'scalaNumerica',
      'proiezione',
      'orientamento',
      'coordinateOC',
      'reticolo',
      'scalaGrafica',
      'scalaGrafica.scala',
      'scalaGrafica.parteRiferita',
      'legende',
      'riproduzioneEsistente',
      'riproduzioneEsistente.tipologia',
      'corredoRicerca',
      'corredoRicerca.tipologia',
      'corredoRicerca.riferimento',
      'corredoRicerca.descrizione'
    ],
    UA: [
      'estremo_remoto',
      'estremo_recente',
      'altraSegnatura',
      'altraSegnatura.numerazione',
      'altraSegnatura.tipologia',
      'altra_intitolazione',
      'altra_intitolazione.intitolazione',
      'altra_intitolazione.tipologia',
      'definizione_tipologia',
      'supporto',
      'consistenza',
      'consistenza.quantita',
      'consistenza.unitaMisura',
      'descrizione_interna',
      'altezza',
      'larghezza',
      'spessore',
      'stato_conservazione',
      'legatura',
      'legatura.tipologia',
      'legatura.epoca',
      'legatura.datazione',
      'condizionamento',
      'condizionamento.tipologia',
      'condizionamento.materia',
      'condizionamento.epoca',
      'condizionamento.datazione',
      'numerazione',
      'numerazione.numerazione',
      'numerazione.tipoNumerazione',
      'numerazione.epoca',
      'numerazione.datazione',
      'descrizioneEsterna',
      'descrizioneEsterna.tipologia',
      'descrizioneEsterna.posizione',
      'descrizioneEsterna.trascrizione',
      'descrizione_interna_tipologia',
      'descrizione_interna_trascrizione',
      'documentazioneTestuale',
      'documentazioneTestuale.tipologia',
      'documentazioneTestuale.lingua',
      'documentazioneGrafica',
      'documentazioneGrafica.tipologia',
      'documentazioneGrafica.tecnicaEsecutiva',
      'documentazioneCopia',
      'documentazioneCopia.tipologia',
      'documentazioneCopia.epoca',
      'strumentoCorredoInterno',
      'strumentoCorredoInterno.tipologia',
      'strumentoCorredoInterno.oggetto',
      'strumentoCorredoInterno.epoca',
      'corredoRicerca',
      'corredoRicerca.tipologia',
      'corredoRicerca.riferimento',
      'corredoRicerca.descrizione'
    ]
  }
};

export default config;

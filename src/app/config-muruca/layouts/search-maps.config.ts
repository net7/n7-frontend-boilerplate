import searchMapsFacetsConfig from './search-maps-facets.config';

export default {
  title: 'Mappe',
  searchId: 'map',
  searchConfig: searchMapsFacetsConfig,
  facetsTitle: 'Filtra i risultati',
  resourcePath: '/map',
  totalResultsText: 'search#maps_total',
  filtersTitle: 'Filtri attivi:',
  sort: {
    label: 'Ordine',
    options: [
      {
        value: '_score',
        label: 'Ordine per pertinenza',
        selected: false,
        disabled: true
      },
      {
        value: 'sort_ASC',
        label: 'Ordine alfabetico (A→Z)',
        selected: true
      },
      {
        value: 'sort_DESC',
        label: 'Ordine alfabetico (Z→A)',
        selected: false
      }
    ]
  },
  pagination: {
    limit: 5,
    options: [
      12,
      24,
      48
    ]
  },
  itemPreview: {
    classes: 'is-vertical'
  },
  fallback: {
    text: 'La tua ricerca non ha dato risultati. Prova a cambiare i parametri oppure a resettare la ricerca cliccando sul pulsante sottostante.',
    button: 'Resetta la ricerca'
  },
  ko: {
    text: 'Oops, abbiamo riscontrato un errore nella ricerca. Prova a cambiare i parametri oppure a resettare la ricerca cliccando sul pulsante sottostante.',
    button: 'Resetta la ricerca'
  }
};

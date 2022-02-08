import { ConfigCommonHeader } from '@net7/boilerplate-common';

const config: ConfigCommonHeader = {
  logo: {
    title: '',
    image: 'https://i.imgur.com/kTND3Do.png',
    anchor: {
      href: 'aw/home'
    }
  },
  nav: {
    items: [
      {
        text: 'Home',
        icon: 'n7-icon-home',
        anchor: {
          href: 'aw/home'
        },
        _meta: {
          id: 'home'
        }
      },
      {
        text: 'Patrimonio',
        anchor: {
          href: 'aw/patrimonio'
        },
        icon: 'n7-icon-tree-icon',
        _meta: {
          id: 'patrimonio'
        }
      },
      {
        text: 'Galleria',
        anchor: {
          href: 'aw/galleria'
        },
        icon: 'n7-icon-th',
        _meta: {
          id: 'galleria'
        }
      },
      {
        text: 'Ricerca',
        anchor: {
          href: 'aw/ricerca'
        },
        icon: 'n7-icon-search',
        _meta: {
          id: 'ricerca'
        }
      },
      {
        text: 'Mappa',
        anchor: {
          href: 'aw/mappa'
        },
        icon: 'n7-icon-map1',
        _meta: {
          id: 'mappa'
        }
      },
      {
        text: 'Timeline',
        anchor: {
          href: 'aw/timeline'
        },
        icon: 'n7-icon-calendar-alt',
        _meta: {
          id: 'timeline'
        }
      },
      {
        text: 'Collezione',
        anchor: {
          href: 'aw/collection/44'
        },
        icon: 'n7-icon-th',
        _meta: {
          id: 'collection'
        }
      }
    ]
  },
  menuToggle: {
    open: {
      payload: 'mobile-open'
    },
    close: {
      payload: 'mobile-close'
    }
  }
};

export default config;

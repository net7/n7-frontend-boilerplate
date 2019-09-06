export default {
  logo: {
    title: 'Example',
    subtitle: 'boilerplate app',
    payload: {
      source: 'route',
      path: ['/']
    }
  },
  nav: {
    items: ['Home', 'About', 'Works'].map(page => ({
      text: page,
      icon: 'n7-icon-home',
      payload: {
        source: 'route',
        path: [`/${page.toLowerCase()}`]
      }
    }))
  },
  actions: [
    { 
      icon: 'n7-icon-bell', 
      payload: {
        source: 'trigger',
        action: 'notification'
      },
      badge: {
        text: "200",
      },
    },
  ],
  menuToggle: {
    open: {
      payload: {
        source: 'trigger',
        action: 'mobile-open'
      },
    },
    close: {
      payload: {
        source: 'trigger',
        action: 'mobile-close'
      },
    }
  }
};
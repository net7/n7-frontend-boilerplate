export default {
  logo: {
    title: 'Example',
    subtitle: 'boilerplate app',
    payload: {
      source: 'navigate',
      handler: 'router',
      path: ['/'],
      // handler: 'static',
      // layout: 'home'
    }
  },
  nav: {
    items: ['Home', 'About', 'Works'].map(page => ({
      text: page,
      icon: 'n7-icon-home',
      payload: {
        source: 'navigate',
        handler: 'router',
        path: [`/${page.toLowerCase()}`]
        // handler: 'static',
        // layout: page.toLowerCase()
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
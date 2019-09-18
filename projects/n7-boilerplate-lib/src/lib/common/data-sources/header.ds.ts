import { DataSource } from '@n7-frontend/core';

export class HeaderDS extends DataSource {
  protected transform(data) {
    console.log('header', data);
    if(!data) return;
    delete data.actions;
    return { ...data, 
       logo: { 
         image: "https://i.imgur.com/kTND3Do.png",
         payload: "click-logo"
       },
       nav: {
        items: [
          { text: 'Home', payload: '/aw/home', icon: 'n7-icon-home' },
          { text: 'Patrimonio', payload: '/aw/patrimonio', icon: 'n7-icon-tree-icon' },
          { text: 'Galleria', payload: '/aw/galleria', icon: 'n7-icon-th' },
          { text: 'Ricerca', payload: '/aw/ricerca', icon: 'n7-icon-search' },
          { text: 'Utenti', payload: '/aw/utenti', icon: 'n7-icon-facebook' },
        ]
      },
      user: {
        img: 'https://placeimg.com/150/150/any/people',
        name: 'Giorgio Spinosa'
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
  }
}

import { DataSource } from '@n7-frontend/core';

export class HeaderDS extends DataSource {
  protected transform(data) {
    console.log('header', data);
    if(!data) return;
    delete data.actions;
    return { ...data, 
       logo: { 
         image: "https://i.imgur.com/SDn9eE5.png",
         payload: "click-logo"
       },
       nav: {
        items: [
          { text: 'Home', payload: '/', icon: 'n7-icon-home' },
          { text: 'Stuff', payload: '/s', icon: 'n7-icon-home' },
          { text: 'Other Stuff', payload: '/os', icon: 'n7-icon-home' }
        ]
      },
    };
  }
}

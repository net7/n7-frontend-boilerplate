import { CardData } from '@n7-frontend/boilerplate';

const config: {
  cards: CardData[];
} = {
  cards: [{
    title: {
      text: 'Card 1',
      classes: 'card-1-title'
    },
    sections: [{
      items: [{
        id: 'item-1',
        type: 'text',
        initialData: '<b>Hello</b> <i>world</i>!',
      }, {
        id: 'item-2',
        type: 'data-widget',
        initialData: {
          icon: 'n7-icon-earth',
          text: '497 <em>Dipendenti</em>',
          subtitle: {
            text: 'In Crescita',
            icon: 'n7-icon-caret-up',
            value: '9%',
            payload: 'view percent tooltip '
          },
          payload: 'view earth tooltip',
          classes: 'is-positive'
        }
      }]
    }]
  }]
};

export default config;

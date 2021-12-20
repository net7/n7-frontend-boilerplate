import { CardData } from '@n7-frontend/boilerplate';

const config: {
  cards: CardData[];
} = {
  cards: [{
    title: {
      text: 'Card 1',
      classes: 'card-1-title'
    },
    actions: [{
      label: null,
      payload: 'action-1-emit',
      icon: 'n7-icon-earth',
      classes: 'action-1-class'
    }, {
      header: {
        // label: 'Options',
        icon: {
          open: 'n7-icon-caret-up',
          close: 'n7-icon-caret-down'
        }
      },
      items: [1, 2, 3, 4, 5].map((number) => ({
        label: `Item ${number}`,
        payload: `item-${number}-emit`,
        // icon: 'n7-icon-earth',
        classes: `item-${number}-class`
      }))
    }],
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
      }, {
        id: 'item-3',
        type: 'apex-pie-chart',
        initialData: {
          series: [{
            id: 'serie-1',
            name: 'Serie 1',
            data: [44, 55, 13, 43, 22]
          }],
          categories: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        },
        options: {
          chart: {
            width: 380,
          }
        }
      }]
    }]
  }]
};

export default config;

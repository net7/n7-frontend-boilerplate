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
    sections: [
      // section 1 ----------------------------------------->
      {
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
      },
      // section 2 ----------------------------------------->
      {
        items: [{
          id: 'item-4',
          type: 'apex-line-chart',
          initialData: {
            series: [{
              id: 'serie-desktops',
              name: 'Desktops',
              data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            }],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          },
          options: {
            chart: {
              height: 350,
              width: 350,
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'straight'
            },
            title: {
              text: 'Product Trends by Month',
              align: 'left'
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
          }
        }, {
          id: 'item-5',
          type: 'apex-bar-chart',
          initialData: {
            series: [{
              id: 'serie-countries',
              name: 'Countries',
              data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
            }],
            categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
          },
          options: {
            chart: {
              height: 350,
              width: 350
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                horizontal: true,
              }
            },
            dataLabels: {
              enabled: false
            },
          }
        }]
      }
    ]
  }]
};

export default config;

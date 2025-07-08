import { ConfigMurucaNetworkLayout } from '@net7/boilerplate-muruca';

const config: ConfigMurucaNetworkLayout = {
  title: 'Mappa dei personaggi',
  mapHeader: 'Sottotitolo',
  libOptions: {
    nodes: {
      shape: 'dot',
      size: 40,
      font: {
        size: 14,
        color: '#333333'
      }
    },
    edges: {
      arrows: {
        to: { enabled: true, scaleFactor: 1.2 }
      },
      width: 1,
      font: {
        size: 10,
        align: 'middle',
        color: '#333333',
        background: '#fff'
      },

    },
    /*     groups: {
      'Fulmine': {
        color: '#fff2cc',
        shape: "icon",
        icon: {
          face: "'Arial Unicode MS'",
          code: "☻",
          size: 40,
          color: "#fff2cc",
        }
      },
      'Altro (Claudio)': {
        color: '#ead1dc',
        shape: "icon",
        icon: {
          face: "'Arial Unicode MS'",
          code: "☻",
          size: 40,
          color: "#ead1dc",
        }
      },
      'Cognizione': {
        color: '#c9daf8',
        shape: "icon",
        icon: {
          face: "'Arial Unicode MS'",
          code: "☻",
          size: 40,
          color: "#c9daf8",
        }
      }
    }, */
    physics: {
      stabilization: true,
      barnesHut: {
        gravitationalConstant: -3000,
        springLength: 300,
        springConstant: 0.02
      }
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
      zoomView: true,
      dragView: true
    },
    layout: {
      improvedLayout: true
    }
  }
};

export default config;

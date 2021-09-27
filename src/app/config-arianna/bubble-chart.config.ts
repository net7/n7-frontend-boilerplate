import { ConfigAriannaBubbleChart } from '@n7-frontend/boilerplate';

const config: ConfigAriannaBubbleChart = {
  fontRendering: {
    label: {
      family: "'Source Sans Pro', sans-serif",
      weight: 'bold'
    },
    counter: {
      family: "'Source Sans Pro', sans-serif",
      weight: 'normal'
    }
  },
  bubbleLimit: 50,
  transition: 750,
  shuffle: true
};

export default config;

import { ConfigMurucaTimelineLayout } from '@net7/boilerplate-muruca';
import * as utc from 'dayjs/plugin/utc';
import * as dayjs from 'dayjs';

dayjs.extend(utc);

const config: ConfigMurucaTimelineLayout = {
  title: 'timeline#title',
  mapHeader: 'timeline#mapheader',
  libOptions: {
    height: '550px',
    locale: 'it_IT',
    cluster: {
      // titleTemplate: 'Clicca per visualizzare {count} eventi',
      maxItems: 2,
    },
    showTooltips: false,
    tooltip: {
      followMouse: false,
      template: (data, element) => `<div class="tooltip">${element.content}</div>`
    },
    template: (itemData, element, data) => {
      if (data.isCluster) {
        const dateLength = data.items.length;
        const startYear = dayjs.utc(data.items[0].start).format('YYYY');
        const endYear = dayjs.utc(data.items[dateLength - 1].start).format('YYYY');
        return `<div class="vis-cluster__title">${dateLength} eventi</div>
        <div class="vis-cluster__date">dal ${startYear} al ${endYear}</div>`; // configurare traduzione
      }
      const truncate = (input) => (input.length > 50 ? `${input.substring(0, 50)}...` : input);
      return `<div>${truncate(data.content)}</div>`;
    },
    width: '100%',
    minHeight: '350px',
    maxHeight: '550px',
    zoomFriction: 8,
    zoomMax: 3000000000000,
    start: '1303-01-06T00:00:00',
    end: '1340-01-06T00:00:00'
  }
};

export default config;

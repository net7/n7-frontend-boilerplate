import { DataSource } from '@n7-frontend/core';
import * as moment from 'moment';

export class AwTimelineDS extends DataSource {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected transform = (data) => ({
    containerID: 'timeline-component',
    libOptions: {
      height: '500px',
      locale: 'it_IT',
      cluster: {
        // titleTemplate: '{count}',
        // fitOnDoubleClick: true,
        clusterCriteria: (f, s) => f.content.charAt(0) === s.content.charAt(0)
      },
      showTooltips: false,
      tooltip: {
        followMouse: false,
        template: (d: any, element: { title: string }) => `<div class="tooltip">${element.title}</div>`
      },
      template: (d: any) => {
        const start = moment(d.start).format('DDMM') === '0101'
          ? moment(d.start).format('YYYY') : moment(d.start).format('DD MMMM YYYY');
        let end: string;
        if (d.end) {
          end = moment(d.end).format('DDMM') === '0101'
            ? moment(d.end).format('YYYY') : moment(d.end).format('DD MMMM YYYY');
        }
        const endHTML = d.end ? `- ${end}` : '';
        return (`<div class="dates"><em>${start}${endHTML}</em></div><div class="content">${d.content}</div>`);
      },
      width: '100%',
      minHeight: '350px',
      maxHeight: '800px',
      // zoomMax: 31557600000, // one year
      zoomFriction: 8
    },
    dataSet: [
      {
        id: 1,
        content: 'Mostra internazionale di edilizia ospedaliera, Roma (1935)',
        start: '1935'
      },
      {
        id: 2,
        content: 'Mostra di edilizia ospedaliera, Fiuggi',
        start: '1942'
      },
      {
        id: 3,
        content: 'I Congresso mondiale di sociologia',
        start: '1951'
      },
      {
        id: 4,
        content: 'V Congresso mondiale di sociologia, Washington D.C. (1962)',
        start: '1962',
      },
      {
        id: 5,
        content: 'Mostra di edilizia pubblica, Pisa',
        start: '1967-06-16',
        end: '1967-06-21'
      },
      {
        id: 6,
        content: 'Strategia della tensione',
        start: '1975',
        end: '1984'
      },
      {
        id: 7,
        content: 'XX Congresso mondiale di sociologia, Roma',
        start: '1995'
      }
    ],
    _setInstance: (timeline) => timeline
  });
}

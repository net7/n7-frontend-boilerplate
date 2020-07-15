import { DataSource } from '@n7-frontend/core';

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
      width: '100%',
      minHeight: '350px',
      maxHeight: '800px',
      // zoomMax: 31557600000, // one year
      zoomFriction: 8
    },
    dataSet: [
      {
        id: 1,
        content: 'item 1',
        start: '2014-04-20'
      },
      {
        id: 2,
        content: 'item 2',
        start: '2014-04-14'
      },
      {
        id: 3,
        content: 'item 3',
        start: '2014-04-18'
      },
      {
        id: 4,
        content: 'item 4',
        start: '2014-04-16',
        end: '2014-04-19'
      },
      {
        id: 5,
        content: 'item 5',
        start: '2014-04-25'
      },
      {
        id: 6,
        content: 'item 6',
        start: '2014-04-27',
        type: 'point'
      }
    ],
    _setInstance: (timeline) => timeline
  });
}

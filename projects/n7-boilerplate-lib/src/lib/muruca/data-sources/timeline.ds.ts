import { TimelineData, TIMELINE_MOCK } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';

// vis-timeline dataset type lookup
type DataSet = TimelineData['dataSet']

export class MrTimelineDS extends DataSource {
  id: string;

  /** timeline instance */
  timeline;

  protected transform(data: { dataSet: DataSet }): TimelineData {
    return TIMELINE_MOCK; // temporarily enable mockup to avoid errors
    return {
      containerID: 'mr-timeline',
      libOptions: {
        height: '500px',
        locale: 'it_IT',
        align: 'left',
        cluster: {
          clusterCriteria: (f, s) => f.content.charAt(0) === s.content.charAt(0)
        },
        showTooltips: false,
        tooltip: {
          followMouse: false,
          template: (d, element) => `<div class="tooltip">${element.title}</div>`
        },
        width: '100%',
        minHeight: '350px',
        maxHeight: '800px',
        zoomFriction: 8
      },
      dataSet: data.dataSet.filter((d) => d.start),
      _setInstance: (timeline) => { this.timeline = timeline; }
    };
  }
}

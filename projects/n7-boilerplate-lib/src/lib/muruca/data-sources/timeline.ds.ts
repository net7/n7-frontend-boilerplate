import { TimelineData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import * as vis from 'vis-timeline';

// vis-timeline dataset type lookup
type DataSet = TimelineData['dataSet']

export class MrTimelineDS extends DataSource {
  id: string;

  /** timeline instance */
  timeline: vis.Timeline;

  public timelineLoaded$: Subject<vis.Timeline> = new Subject();

  protected transform(data: { dataSet: DataSet }): TimelineData {
    return {
      containerID: 'mr-timeline',
      libOptions: {
        height: '500px',
        locale: 'it_IT',
        align: 'left',
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
      dataSet: data.dataSet.map((d) => {
        // Show dates that have identical start and end dates as points
        if (d.end && d.end === d.start) {
          return { ...d, ...{ end: undefined } };
        } return d;
      }),
      _setInstance: (timeline) => {
        this.timeline = timeline;
        this.timelineLoaded$.next(timeline);
      }
    };
  }
}

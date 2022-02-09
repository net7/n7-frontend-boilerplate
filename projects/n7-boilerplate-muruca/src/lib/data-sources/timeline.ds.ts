import { TimelineData } from '@net7/components';
import { DataSource } from '@net7/core';
import { Subject } from 'rxjs';
import { Timeline } from 'vis-timeline';

// vis-timeline dataset type lookup
type DataSet = TimelineData['dataSet']

export class MrTimelineDS extends DataSource {
  id: string;

  /** timeline instance */
  timeline: Timeline;

  public timelineLoaded$: Subject<Timeline> = new Subject();

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
        zoomFriction: 8,
        ...this.options.libOptions
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

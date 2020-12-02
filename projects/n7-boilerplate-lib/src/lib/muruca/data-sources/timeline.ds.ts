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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // dataSet: data.dataSet.filter((d) => d.start && `${d.start}`.length === 4),
      dataSet: [{
        // Mock di un elemento cliccabile
        start: '2014-04-17', id: 2992, type: 'point', content: 'Missione Venezia'
      }],
      _setInstance: (timeline) => {
        this.timeline = timeline;
        this.timelineLoaded$.next(timeline);
      }
    };
  }
}

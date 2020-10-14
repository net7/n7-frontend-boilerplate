import { DataSource } from '@n7-frontend/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';

export class AwTimelineDS extends DataSource {
  public timeline;

  public timelineLoaded$: Subject<void> = new Subject();

  public dataSet;

  protected transform = (data) => {
    this.dataSet = data.map(({
      id, label, start, end, item
    }) => ({
      id,
      item,
      start: start ? moment(start).format('YYYY-MM-DD') : null,
      end: end && end !== start ? moment(end).format('YYYY-MM-DD') : null,
      content: label
    }));
    return {
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
        /* template: (d: any) => {
          const start = moment(d.start).format('DDMM') === '0101'
            ? moment(d.start).format('YYYY') : moment(d.start).format('DD MMMM YYYY');
          let end: string;
          if (d.end) {
            end = moment(d.end).format('DDMM') === '0101'
              ? moment(d.end).format('YYYY') : moment(d.end).format('DD MMMM YYYY');
          }
          const endHTML = d.end ? `- ${end}` : '';
          return (`
            <div class="dates">
              <em>${start}${endHTML}</em>
            </div>
            <div class="content">${d.content}</div>
          `);
        } */
        width: '100%',
        minHeight: '350px',
        maxHeight: '800px',
        // zoomMax: 31557600000, // one year
        zoomFriction: 8
      },
      dataSet: this.dataSet,
      _setInstance: (timeline) => {
        this.timeline = timeline;
        this.timelineLoaded$.next();
      }
    };
  };
}

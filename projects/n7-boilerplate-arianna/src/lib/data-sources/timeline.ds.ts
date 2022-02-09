import { DataSource } from '@net7/core';
import * as moment from 'moment';
import { max as _max, min as _min } from 'lodash';
import { Subject } from 'rxjs';

const ONE_YEAR = 31557600000;
const YEARS_MARGIN = 30;

export class AwTimelineDS extends DataSource {
  public timeline;

  public timelineLoaded$: Subject<void> = new Subject();

  public dataSet;

  public timelineControlsVisible = false;

  protected transform = (data) => {
    const { disableEndDates } = this.options.configuration;
    this.dataSet = data.map(({
      id, start, end, item, label
    }) => ({
      id,
      item,
      start: start ? moment(start).format('YYYY-MM-DD') : null,
      end: (end && end !== start && !disableEndDates)
        ? moment(end).format('YYYY-MM-DD') // show end date
        : null, // hide end date
      content: this.getItemTemplate(label, item.label),
      _meta: {
        dateText: label
      }
    }));

    const max = this.getMax();
    const min = this.getMin();

    return {
      containerID: 'timeline-component',
      libOptions: {
        max,
        min,
        start: min,
        end: max,
        align: 'left',
        minHeight: '100px',
        // height: '100px',
        locale: 'it_IT',
        // cluster: {
        // fitOnDoubleClick: true,
        // clusterCriteria: (f, s) => f.content.charAt(0) === s.content.charAt(0),
        //   titleTemplate: '{count} eventi',
        // },
        showCurrentTime: false,
        showTooltips: false,
        tooltip: {
          followMouse: false,
          template: (d: any, element: { title: string }) => `<div class="tooltip">${element.title}</div>`
        },
        width: '100%',
        // minHeight: '350px',
        // maxHeight: '800px',
        zoomMax: ONE_YEAR * 2000, // 2000 years
        zoomMin: ONE_YEAR / 12, // a month
        // zoomFriction: 8
      },
      dataSet: this.dataSet,
      _setInstance: (timeline) => {
        this.timeline = timeline;
        this.timelineLoaded$.next();

        // fix cluster visualization
        setTimeout(() => {
          this.timeline.fit();
        });

        // timeout for zoom controls
        setTimeout(() => {
          this.timelineControlsVisible = true;
        }, 1000);
      }
    };
  }

  getItemTemplate(datesLabel, label) {
    return (`
      <div class="dates">
        <em>${datesLabel}</em>
      </div>
      <div class="content">${label}</div>
    `);
  }

  getMax() {
    const maxDate = new Date(_max(this.getAllDates()));

    const year = maxDate.getFullYear();
    const month = maxDate.getMonth();
    const day = maxDate.getDate();
    return new Date(year + YEARS_MARGIN, month, day);
  }

  getMin() {
    const minDate = new Date(_min(this.getAllDates()));

    const year = minDate.getFullYear();
    const month = minDate.getMonth();
    const day = minDate.getDate();
    return new Date(year - YEARS_MARGIN, month, day);
  }

  getAllDates() {
    return [
      ...this.dataSet
        .filter(({ start }) => start)
        .map(({ start }) => start),
      ...this.dataSet
        .filter(({ end }) => end)
        .map(({ end }) => end)
    ];
  }
}

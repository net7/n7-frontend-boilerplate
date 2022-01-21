import { HistogramRangeData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { FacetDataSource } from './facet-datasource';

const ACTIVE_CLASS = 'is-active';

type FACET_VALUE = string;

export class FacetHistogramDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE = '';

  isUpdate = false;

  histogramApi: any;

  protected transform({ links }): HistogramRangeData {
    // Remap the response values in the correct
    // format for histogram-range-component
    const items = links.map((link) => ({
      label: link.text,
      value: link.counter,
      payload: link.payload,
      range: link.range ? {
        payload: link.range.payload,
        label: link.range.text
      } : undefined,
    })).sort((a, b) => +a.label - b.label);

    const histogramData: HistogramRangeData = {
      containerId: 'container-for-histogram',
      width: 450,
      height: 50,
      colours: {
        top: '#7091B3',
        bottom: '#96c2f2',
        accent: '#2F528B',
      },
      margin: {
        left: 30,
        right: 0,
        top: 10,
        bottom: 45
      },
      axis: {
        yAxis: {
          show: true,
          // tickAmount: 3
          values: [0, 5, 20, 60]
        }
      },
      items,
      setApi: (api) => {
        if (!this.histogramApi) this.histogramApi = api;
        // console.log('api was set');
        // if (this.value) {
        //   const [firstYear, lastYear] = this.value.split('-');
        //   const firstLabel = this.getFirstLabel(firstYear);
        //   const lastLabel = this.getLastLabel(lastYear);
        //   setTimeout(() => {
        //     this.histogramApi.setValue([firstLabel, lastLabel]);
        //   }, 3000);
        // }
      }
    };

    if (this.value) {
      const [firstYear, lastYear] = this.value.split('-');
      const firstLabel = this.getFirstLabel(firstYear, items);
      const lastLabel = this.getLastLabel(lastYear, items);
      histogramData.setSliders = [firstLabel, lastLabel];
    }

    return histogramData;
  }

  setValue = (value, update = false) => {
    // console.log('setting value', value);
    // console.log(this.histogramApi);
    this.value = value;
    this.isUpdate = update;
    // const sliders = value.split('-');

    if (update && this.input) {
      const { links } = this.input;
      const updatedLinks = links.map((link) => ({
        ...link,
        classes: this.value && (this.value === link.payload) ? ACTIVE_CLASS : ''
      }));
      this.update({
        ...this.input,
        links: updatedLinks,
        // setSliders: sliders ?? undefined,
      });
    }

    setTimeout(() => {
      // console.log(this.histogramApi);
    });

    this.loadTooltips();
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = '';
  }

  loadTooltips() {
    const elements = document.querySelectorAll('#container-for-histogram g.bars rect.bars');
    tippy(elements, {
      content(reference) {
        const start = reference.getAttribute('data-start');
        const end = reference.getAttribute('data-end');
        return `<span class="tippy-template">${start}<br>${end}</span>`;
      },
      allowHTML: true,
      appendTo: () => document.body,
    });
  }

  private getFirstLabel(year: string, items) {
    return items.find(({ label }) => +label === +year)?.label;
  }

  private getLastLabel(year: string, items) {
    return items.find(({ label, range }) => {
      if (range) {
        return +range.label === +year;
      }
      return +label === +year;
    })?.label;
  }
}

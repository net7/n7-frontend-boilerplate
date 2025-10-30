import { HistogramRangeData } from '@net7/components';
import { DataSource } from '@net7/core';
import tippy from 'tippy.js';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string;

export class FacetHistogramDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE = '';

  isUpdate = false;

  histogramApi: any;

  protected transform({ links }): HistogramRangeData {
    const items = this.parseLinks(links); // format data

    const histogramData: HistogramRangeData = {
      containerId: `container-for-histogram-${this.id}`,
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
        if (this.value) {
          const [firstYear, lastYear] = this.value.split('-');
          const firstLabel = this.getFirstLabel(firstYear, items);
          const lastLabel = this.getLastLabel(lastYear, items);
          setTimeout(() => {
            // when the component loads, set the sliders and the bars
            // (necessary if search url has params)
            this.histogramApi.setSliders([firstLabel, lastLabel]);
            this.histogramApi.setBars(items);
          });
        }
      }
    };
    return histogramData;
  }

  setValue = (value, update = false) => {
    this.value = value;
    this.isUpdate = update;

    if (update && this.input) {
      const { links } = this.input;
      this.update({ ...this.input, links });
      if (!this.histogramApi) return;
      // format the new bars data
      const newBars = this.parseLinks(links);
      const [firstYear, lastYear] = this.value.split('-');
      // get years for slider positions
      const firstLabel = this.getFirstLabel(firstYear, newBars);
      const lastLabel = this.getLastLabel(lastYear, newBars);
      // update the histogram
      setTimeout(() => {
        this.histogramApi.setSliders(
          [`${firstLabel}`, `${lastLabel}`], // move the sliders
          false // do not emit
        );
        this.loadTooltips();
      });
      this.histogramApi.setBars(newBars);
    }
    // reload the tooltips
    this.loadTooltips();
  };

  /**
   * Returns the current facet value
   */
  getValue = (): FACET_VALUE => this.value;

  /**
   * Reset to the default facet value
   */
  clear() {
    this.value = '';
  }

  /**
   * Loads tippy tooltips and appends them to the histogram bars
   */
  loadTooltips() {
    const elements = document.querySelectorAll(`#container-for-histogram-${this.id} g.bars rect.bars`);
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

  /**
   * Convert the links into the histogram component format
   */
  parseLinks(links) {
    return links.map((link) => ({
      label: `${link.text}`,
      value: link.counter,
      payload: link.payload,
      range: link.range ? {
        payload: link.range.payload,
        label: link.range.text
      } : undefined,
    })).sort((a, b) => +a.label - b.label);
  }

  /**
   * Get the left-most label
   */
  private getFirstLabel(year: string, items) {
    if (!year) return items[0].label;
    return items.find(({ label }) => +label === +year)?.label;
  }

  /**
   * Get the right-most label
   */
  private getLastLabel(year: string, items) {
    if (!year) return items[items.length - 1].label;
    return items.find(({ label, range }) => {
      if (range) {
        return +range.label === +year;
      }
      return +label === +year;
    })?.label;
  }
}

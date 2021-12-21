import { HistogramRangeData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';
import { FacetDataSource } from './facet-datasource';

const ACTIVE_CLASS = 'is-active';

type FACET_VALUE = string;

export class FacetHistogramDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE = '';

  isUpdate = false;

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

    return {
      containerId: 'container-for-histogram',
      width: 450,
      height: 50,
      colours: {
        top: '#7091B3',
        bottom: '#96c2f2',
        accent: '#2F528B',
      },
      margin: {
        left: 0,
        right: 0,
        top: 10,
        bottom: 45
      },
      items,
    };
  }

  setValue(value, update = false) {
    this.value = value;
    this.isUpdate = update;

    if (update) {
      const { links } = this.input;
      const updatedLinks = links.map((link) => ({
        ...link,
        classes: this.value && (this.value === link.payload) ? ACTIVE_CLASS : ''
      }));
      this.update({
        ...this.input,
        links: updatedLinks
      });
    }
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = '';
  }
}

import { HistogramRangeData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';
import { FacetDataSource } from './facet-datasource';

const ACTIVE_CLASS = 'is-active';

type FACET_VALUE = any[];

export class FacetHistogramDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE = [];

  isUpdate = false;

  protected transform({ links }): HistogramRangeData {
    return {
      containerId: 'container-for-histogram',
      width: 300,
      height: 50,
      colours: {
        top: '#F5AE34',
        bottom: '#FBD45E',
        accent: '#1857B6',
      },
      margin: {
        left: 0,
        right: 0,
        top: 10,
        bottom: 45
      },
      items: links,
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
    this.value = [];
  }
}

import { DataSource } from '@n7-frontend/core';
import { InputLink, InputLinkData } from '@n7-frontend/components';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string[];

const ACTIVE_CLASS = 'is-active';

export class FacetLinkDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE = [];

  protected transform(data: InputLinkData): InputLinkData {
    return data;
  }

  setValue(value: FACET_VALUE, update = false) {
    this.value = Array.isArray(value) ? value : [value];

    if (update) {
      const { links } = this.input;
      const updatedLinks = links.map((link: InputLink) => ({
        ...link,
        classes: this.value.indexOf(link.payload) !== -1 ? ACTIVE_CLASS : ''
      }));
      this.update({
        ...this.input,
        links: updatedLinks
      });
    }
  }

  toggleValue(linkValue) {
    const exists = this.value.indexOf(linkValue) !== -1;
    if (!exists) {
      this.value.push(linkValue);
    } else if (exists) {
      this.value.splice(this.value.indexOf(linkValue), 1);
    }

    // update
    this.setValue(this.value, true);
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = [];
  }
}

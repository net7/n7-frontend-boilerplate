import { DataSource } from '@n7-frontend/core';
import { InputLink, InputLinkData } from '@n7-frontend/components';
import { FacetDataSource } from './facet-datasource';

const ACTIVE_CLASS = 'is-active';

export class FacetLinkDS extends DataSource implements FacetDataSource {
  id: string;

  value = null;

  protected transform(data: InputLinkData): InputLinkData {
    return data;
  }

  setValue(value, update = false) {
    this.value = value;

    if (update) {
      const { links } = this.input;
      const updatedLinks = links.map((link: InputLink) => ({
        ...link,
        classes: this.value === link.payload ? ACTIVE_CLASS : ''
      }));
      this.update({
        ...this.input,
        links: updatedLinks
      });
    }
  }

  toggleValue(linkValue) {
    // update
    this.setValue(this.value !== linkValue ? linkValue : null, true);
  }

  getValue = () => this.value;

  clear() {
    this.value = null;
  }
}

import { DataSource, _t } from '@n7-frontend/core';
import { InputLink, InputLinkData } from '@n7-frontend/components';
import { FacetDataSource } from './facet-datasource';

const ACTIVE_CLASS = 'is-active';

export class FacetLinkDS extends DataSource implements FacetDataSource {
  id: string;

  value = null;

  private isUpdate = false;

  protected transform(data: InputLinkData): InputLinkData {
    const { links } = data;
    // empty state check
    if (this.isUpdate && !links.length) {
      return {
        links: [{
          text: _t('global#facet_empty_text'),
          classes: 'empty-text-link',
          payload: null,
        }]
      };
    }
    return data;
  }

  setValue(value, update = false) {
    this.value = value;
    this.isUpdate = update;

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

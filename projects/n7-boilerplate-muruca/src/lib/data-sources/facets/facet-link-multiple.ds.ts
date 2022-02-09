import { DataSource, _t } from '@net7/core';
import { InputLink, InputLinkData } from '@net7/components';
import { FacetDataSource } from './facet-datasource';

const ACTIVE_CLASS = 'is-active';

export class FacetLinkMultipleDS extends DataSource implements FacetDataSource {
  id: string;

  value = [];

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
        classes: this.value.includes(link.payload) ? ACTIVE_CLASS : ''
      }));
      this.update({
        ...this.input,
        links: updatedLinks
      });
    }
  }

  toggleValue(linkValue) {
    const exists = this.value.includes(linkValue);
    if (!exists) {
      this.value.push(linkValue);
    } else if (exists) {
      this.value.splice(this.value.indexOf(linkValue), 1);
    }

    // update
    this.setValue(this.value, true);
  }

  getValue = () => this.value;

  clear() {
    this.value = [];
  }
}

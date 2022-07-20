import { DataSource, _t } from '@net7/core';
import { isObject, merge } from 'lodash';

export class MrMetadataDS extends DataSource {
  /** Test if a string is a valid URL */
  isUrl = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

  /** Turn a string into an anchor element */
  toUrl = (string: string) => `<a href="${string}" target="_blank">${string}<a>`;

  protected transform(data: any): any {
    if (!data) return null;

    const { hideLabels, readmore } = this.options;
    const { group } = data;

    if (!(group || []).length) {
      return null;
    }

    // default fallback settings
    const defaults = {
      height: 300,
      labels: {
        more: _t('global#readmore'),
        less: _t('global#readless')
      }
    };

    const result = { group: [] };
    group
      .filter(({ items }) => Array.isArray(items))
      .forEach(({ items }) => {
        items
          .filter((item) => isObject(item))
          .forEach(({ label, value }) => {
            const itemLabel = label && !hideLabels ? label : null;
            if (Array.isArray(value)) {
              result.group.push({
                group: [{
                  title: _t(itemLabel),
                  classes: `mrc-${itemLabel}`,
                  ...this.getItemGroup(value)
                }]
              });
            } else {
              result.group.push({
                group: [{
                  // use default values if not specified
                  readmore: merge({ ...defaults }, readmore),
                  classes: `mrc-${itemLabel}`,
                  items: value ? [{
                    label: _t(itemLabel),
                    value: this.getItemValue(value)
                  }] : []
                }]
              });
            }
          });
      });
    return result;
  }

  private getItemGroup(value) {
    if (Array.isArray(value) && Array.isArray(value[0])) {
      return {
        group: value.map((val) => ({
          ...this.getItemGroup(val)
        }))
      };
    }
    return {
      items: value
        .filter((childItem) => !!childItem.value)
        .map((childItem) => ({
          label: _t(childItem.label),
          value: this.getItemValue(childItem.value)
        }))
    };
  }

  private getItemValue(value) {
    return this.isUrl.test(value) ? this.toUrl(value) : value;
  }
}

import { DataSource, _t } from '@net7/core';
import { isObject, merge } from 'lodash';
import { GroupObject, MetadataOutput } from '../interfaces/metadata.interface';

export class MrMetadataDS extends DataSource {
  /** Test if a string is a valid URL */
  isUrl = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

  /** Turn a string into an anchor element */
  toUrl = (string: string) => `<a href="${string}" target="_blank">${string}<a>`;

  defaultReadmore = {
    height: 300,
    labels: {
      more: _t('global#readmore'),
      less: _t('global#readless')
    }
  };

  public transform(data: GroupObject): MetadataOutput {
    if (!data) return null;

    // readmore applies to the whole metadata group, while
    // groupReadmore applies to the nested metadata sub-groups
    const { hideLabels, readmore, groupReadmore } = this.options;
    const { group } = data;

    if (!(group || []).length) {
      return null;
    }

    const result = { group: [] };
    group
      .filter(({ items }) => Array.isArray(items))
      .forEach(({ items }) => {
        items
          .filter((item) => isObject(item))
          .forEach(({ label, value }) => {
            const itemLabel = label && !hideLabels ? label : null;
            const classLabel = label && !hideLabels ? label.replace(/ /g, '_').toLowerCase() : null;
            if (Array.isArray(value)) {
              result.group.push({
                group: [{
                  title: _t(itemLabel),
                  classes: `mrc-${classLabel}`,
                  // use default values if not specified
                  readmore: merge({ ...this.defaultReadmore }, readmore),
                  groupReadmore,
                  ...this.getItemGroup(value)
                }]
              });
            } else {
              result.group.push({
                group: [{
                  // use default values if not specified
                  readmore: merge({ ...this.defaultReadmore }, readmore),
                  groupReadmore,
                  classes: `mrc-${classLabel}`,
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
    const { groupReadmore } = this.options;
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
          value: this.getItemValue(childItem.value),
        })),
      // load the optional "readmore" configuration
      groupReadmore,
    };
  }

  private getItemValue(value) {
    return this.isUrl.test(value) ? this.toUrl(value) : value;
  }
}

import { DataSource } from '@n7-frontend/core';
import helpers from '../../common/helpers';

export class AwSchedaMetadataDS extends DataSource {
  protected transform(data) {
    let { labels } = this.options;
    labels = labels || {};

    const group = { group: [] };
    if (data.fields) {
      data.fields.forEach((field) => {
        const items = [];
        if (field.fields) {
          field.fields.forEach((item) => {
            items.push({
              label: helpers.prettifySnakeCase(item.key, labels[item.key]),
              value: item.value
            });
          });

          group.group.push({
            items,
            title: field.label,
          });
        } else {
          items.push({
            label: helpers.prettifySnakeCase(field.key, labels[field.key]),
            value: field.value
          });
          group.group.push({
            items,
          });
        }
      });
    }
    return group;
  }
}

import { DataSource } from '@n7-frontend/core';
import helpers from '../../common/helpers';

export class AwSchedaMetadataDS extends DataSource {
  protected transform(data) {
    let { labels, metadataToExclude } = this.options;
    labels = labels || {};
    metadataToExclude = metadataToExclude || {};
    metadataToExclude = metadataToExclude[data.document_type] || [];

    const group = { group: [] };
    if (data.fields) {
      data.fields.forEach((field) => {
        const items = [];
        if (field.fields) {
          field.fields
            .filter((item) => metadataToExclude.indexOf(item.key) === -1)
            .forEach((item) => {
              items.push({
                label: helpers.prettifySnakeCase(item.key, labels[item.key]),
                value: item.value
              });
            });

          group.group.push({
            items,
            title: field.label,
          });
        } else if (metadataToExclude.indexOf(field.key) === -1) {
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

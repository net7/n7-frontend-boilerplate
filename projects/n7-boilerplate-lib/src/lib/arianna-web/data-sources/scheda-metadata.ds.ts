import { DataSource } from '@n7-frontend/core';
import helpers from '../../common/helpers';

export class AwSchedaMetadataDS extends DataSource {
  protected transform(data) {
    let { labels, metadataToShow } = this.options;
    labels = labels || {};
    metadataToShow = metadataToShow || {};
    metadataToShow = metadataToShow[data.document_type] || [];

    const group = [];
    if (data.fields) {
      data.fields.forEach((field) => {
        const items = [];
        if (field.fields && metadataToShow.indexOf(field.label) !== -1) {
          field.fields
            .filter((item) => metadataToShow.indexOf(item.key) !== -1)
            .forEach((item) => {
              items.push({
                label: helpers.prettifySnakeCase(item.key, labels[`${data.document_type}.${item.key}`]),
                value: item.value,
                order: metadataToShow.indexOf(item.key)
              });
            });

          // sort by order (by metadata-to-show)
          items.sort((a, b) => a.order - b.order);
          group.push({
            items,
            title: field.label,
            order: metadataToShow.indexOf(field.label)
          });
        } else if (metadataToShow.indexOf(field.key) !== -1) {
          items.push({
            label: helpers.prettifySnakeCase(field.key, labels[`${data.document_type}.${field.key}`]),
            value: field.value.replace(/(\|\|\|)/g, '\n'), // replace repeat sequence ("|||") with end of line
          });
          group.push({
            items,
            order: metadataToShow.indexOf(field.key)
          });
        }
      });
    }

    // sort by order (by metadata-to-show)
    group.sort((a, b) => a.order - b.order);
    return { group };
  }
}

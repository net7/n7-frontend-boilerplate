import { DataSource } from "@n7-frontend/core";
import helpers from "../../common/helpers";

export class AwSchedaMetadataDS extends DataSource {
  protected transform(data) {
    let { labels } = this.options;
    labels = labels || {};

    let group = { group: [] };
    if (data.fields) {
      data.fields.forEach(field => {
        let items = [];
        if (field.fields) {
          field.fields.forEach(item => {
            items.push({ label: helpers.prettifySnakeCase(item.key, labels[item.key]), value: item.value });
          });

          group.group.push({
            title: field.label,
            items: items
          });
        } else {
          items.push({ label: helpers.prettifySnakeCase(field.key, labels[field.key]), value: field.value });
          group.group.push({
            items: items
          });
        }
      });
    }
    return group;
  }
}

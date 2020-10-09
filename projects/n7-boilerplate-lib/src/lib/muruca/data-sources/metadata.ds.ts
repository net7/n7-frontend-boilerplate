import { DataSource } from '@n7-frontend/core';

export class MrMetadataDS extends DataSource {
  /** Test if a string is a valid URL */
  isUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/

  /** Turn a string into an anchor element */
  toUrl = (string: string) => `<a href="${string}" target="_blank">${string}<a>`

  protected transform(data: any): any {
    const { hideLabels } = this.options;
    const { group } = data;
    const result = { group: [] };
    group.forEach(({ items }) => {
      items.forEach(({ label, value }) => {
        const itemLabel = label && !hideLabels ? label : null;
        if (Array.isArray(value)) {
          result.group.push({
            group: [{
              title: itemLabel,
              items: value.map((childItem) => ({
                label: childItem.label,
                value: this.getItemValue(childItem.value)
              }))
            }]
          });
        } else {
          result.group.push({
            group: [{
              items: [{
                label: itemLabel,
                value: this.getItemValue(value)
              }]
            }]
          });
        }
      });
    });
    return result;
  }

  private getItemValue(value) {
    return this.isUrl.test(value) ? this.toUrl(value) : value;
  }
}

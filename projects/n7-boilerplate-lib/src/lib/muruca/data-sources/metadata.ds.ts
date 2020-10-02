import { DataSource } from '@n7-frontend/core';

export class MrMetadataDS extends DataSource {
  /** Test if a string is a valid URL */
  isUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/

  /** Turn a string into an anchor element */
  toUrl = (string: string) => `<a href="${string}" target="_blank">${string}<a>`

  protected transform(data: any): any {
    const { hideLabels } = this.options;
    const group = data.group.map((d) => {
      let { items } = d;
      // Convert URLs to anchor elements and remove labels if necessary
      items = d.items
        .filter(({ label, value }) => label && value)
        .map(({ label, value }) => {
          const newItem = {} as { label?: string; value?: string };
          // value check
          if (value) {
            if (this.isUrl.test(value)) {
              newItem.value = this.toUrl(value);
            } else {
              newItem.value = value;
            }
          }

          if (label && !hideLabels) {
            newItem.label = label;
          }
          return newItem;
        });

      return { items };
    });
    // Overwrite the metadata group
    data.group = group;
    return data;
  }
}

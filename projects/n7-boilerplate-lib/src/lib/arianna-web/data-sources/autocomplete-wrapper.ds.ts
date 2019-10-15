import { DataSource } from '@n7-frontend/core';

export class AwAutocompleteWrapperDS extends DataSource {

  protected transform(data) {
    const { key, response } = data
    const regex = new RegExp('(.*?)' + key + '(.*)')
    const append = []

    response.items.forEach(el => {
      let position = el.item.label.indexOf(key)
      // if the typed text is not in the label, skip it
      if (position < 0) {
        return;
      }
      // divide prefix and suffix
      let match = el.item.label.match(regex)
      let prefix = match[1]
      let suffix = match[2]
      append.push({ prefix, suffix, payload: el.item.id })
    });
    return { typed: key, append }
  }
}
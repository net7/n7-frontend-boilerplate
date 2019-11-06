import { DataSource } from '@n7-frontend/core';

export class AwAutocompleteWrapperDS extends DataSource {

  protected transform(data) {
    const { key, response } = data
    const regex = new RegExp('(.*?)' + key + '(.*)', 'i') // 'i' = case insensitive
    const suggestion = []
    const config = this.options.config
    const maxLength = config.get('home-layout')['max-item-length'] / 2

    response.entities.forEach(el => {
      // divide prefix and suffix
      // let match = el.item.label.match(regex)
      let match = regex.exec(el.entity.label)
      if (match) {
        let prefix = match[1]
        let suffix = match[2]
        // string manipulation
        if (maxLength && (prefix.length > maxLength)) {
          prefix = '...' + prefix.slice(prefix.length - maxLength, prefix.length)
        }
        if (maxLength && (suffix.length > maxLength)) {
          suffix = suffix.slice(0, maxLength) + '...'
        }
        suggestion.push({
          match: match.input.slice(match[1].length, match[1].length + key.length),
          prefix,
          suffix,
          payload: el.entity.id
        })
      }
    });
    return { suggestion }
  }
}
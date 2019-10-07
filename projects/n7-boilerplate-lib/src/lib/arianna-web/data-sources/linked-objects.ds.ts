import { DataSource } from '@n7-frontend/core';
import { PAGINATION_MOCK } from '@n7-frontend/components';

export class AwLinkedObjectsDS extends DataSource {

  protected transform(data) {
    const KEYS = this.options.configKeys
    const PAGE = this.options.page
    const SIZE = this.options.size
    return unpackData(data, PAGE, SIZE, KEYS)
  }
}

function unpackData (data, page, size, keys) {
  if (size) {
    data = data.slice(page * size - size, page * size)
  }
  var result = []
  data.forEach(el => {
    let item = {
      image: el.thumbnail,
      title: el.item.label,
      text: el.item.info[1].value,
      payload: el.item.id,
      metadata: [
        {
          classes: 'n7-objects__metadata-artist',
          items: [
            { // Artista: Mimmo Jodice
              // label: el.item.info[0].key,
              label: 'Autore',
              value: el.item.info[0].value
            }
          ]
        },
        {
          classes: 'n7-objects__metadata-linked',
          items: el.relatedTOEData.map( toe => {
            return { // Persone: 6, Organizz: 12, Luoghi: 2, Concetti: 32
              value: toe.count,
              // icon: 'n7-icon-bell' // TODO: link icon to config key
              icon: keys[toe.type.configKey].icon 
            }
          })
        }
      ]
    };
    if ( el.breadcrumbs ) {
      item['breadcrumbs'] = { // n7-breadcrumbs uses this as it's own data
      items: el.breadcrumbs.map( crumb => {
          return {
           label: crumb.label,
           payload: crumb.link,
          }
        })
      };
    }
    result.push(item);
  });
  if ( page ) { // if I'm on a page, render pagination data.
    return {
      pagination: {
        first: { payload: "first", classes: "is-disabled" },
        prev: { payload: "prev", classes: "is-disabled" },
        next: { payload: "next" },
        last: { payload: "last" },
        links: [
          { text: "1", payload: 1, classes: "is-active" },
          { text: "2", payload: 2 },
          { text: "3", payload: 3 },
          { text: "4", payload: 4 },
          { text: "5", payload: 5 },
        ]
      },
      previews: result 
    }
  }
  return result;
}
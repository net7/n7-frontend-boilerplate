import { DataSource } from '@n7-frontend/core';

export class AwLinkedObjectsDS extends DataSource {

  public totalPages:Number
  public currentPage:Number
  public pageSize:Number

  protected transform(data) {
    const KEYS = this.options.configKeys
    this.pageSize = this.options.size
    this.currentPage = Number(this.options.page)
    this.totalPages = Math.floor(data.length / Number(this.pageSize))
    return unpackData(data, this.currentPage, this.pageSize, KEYS, this.totalPages)
  }
}

function unpackData (data, page, size, keys, totalPages) {
  if (size && page) {
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
        first: { payload: `goto-${1}`, classes: page == 1 ? "is-disabled" : '' },
        prev: { payload: `goto-${page-1}`, classes: page == 1 ? "is-disabled" : '' },
        next:  { payload: `goto-${page+1}`, classes: page == totalPages ? "is-disabled" : ''},
        last:  { payload: `goto-${totalPages}`, classes: page == totalPages ? "is-disabled" : ''},
        links: makePagination(totalPages, page),
      },
      previews: result 
    }
  }
  return result;
}

function makePagination (totalPages, currentPage) {
  let result = []
  for (let i = 0; i < totalPages; i++) {
    if (i + 1 === currentPage) {
      result.push({ text: String(i+1), payload: 'page-' + String(i+1), classes: 'is-active' })
    } else {
      result.push({ text: String(i+1), payload: 'page-' + String(i+1) })
    }
  }
  return result
}
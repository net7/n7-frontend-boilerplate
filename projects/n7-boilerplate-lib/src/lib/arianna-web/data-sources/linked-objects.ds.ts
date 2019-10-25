import { DataSource } from '@n7-frontend/core';

export class AwLinkedObjectsDS extends DataSource {

  public totalPages: number
  public currentPage: number
  public pageSize: number
  public context: string

  protected transform(data) {
    const KEYS = this.options.configKeys
    this.pageSize = this.options.size
    this.currentPage = Number(this.options.page)
    this.totalPages = Math.floor(data.length / Number(this.pageSize))
    this.context = this.options.context
    return unpackData(data, this.currentPage, this.pageSize, KEYS, this.totalPages, this.context)
  }
}

function unpackData (data, page, size, keys, totalPages, context) {
  // resize data
  if (size && page) {
    data = data.slice(page * size - size, page * size)
  } else if ( size ) {
    data = data.slice(0, size)
  }

  var result = []
  data.forEach(el => {
    let item = {
      image: el.thumbnail,
      title: el.item.label,
      payload: el.item.id,
      classes: ['entita', 'search'].includes(context) ? 'is-fullwidth' : '',
      metadata: [
        {
          classes: 'n7-objects__metadata-artist',
          items: el.item.info.map(({ value, key }) => ({
            label: key === 'author' ? 'Artista' : null,
            value 
          }))
        },
        {
          classes: 'n7-objects__metadata-linked',
          items: el.relatedTOEData.map( toe => {
            return { // Persone: 6, Organizz: 12, Luoghi: 2, Concetti: 32
              value: toe.count,
              // icon: 'n7-icon-bell' // TODO: link icon to config key
              icon: keys[toe.type.configKey].icon,
              classes: 'color-' + toe.type.configKey
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
    let sizeOptions = [10, 25, 50]
    return {
      pagination: {
        first: { payload: `goto-${1}`, classes: page == 1 ? "is-disabled" : '' },
        prev: { payload: `goto-${page-1}`, classes: page == 1 ? "is-disabled" : '' },
        next:  { payload: `goto-${page+1}`, classes: page == totalPages ? "is-disabled" : ''},
        last:  { payload: `goto-${totalPages}`, classes: page == totalPages ? "is-disabled" : ''},
        links: makePagination(totalPages, page),
        select: {
          label: 'Numero di risultati',
          options: sizeOptions.map(o => {
            return {
              text: o,
              selected: o == size,
              // disables options greater than total items
              // disabled: o > totalPages*size
            }
          }),
          payload: 'select-size'
        }
      },
      previews: result 
    }
  }
  return result;
}

function makePagination (totalPages, currentPage) {
  let result = []
  // always push the first page
  result.push({ text: '1', payload: 'page-1', classes: currentPage==1? 'is-active' : '' })

  for (let i = 1; i < totalPages; i++) {
    result.push({ text: String(i + 1), payload: 'page-' + String(i + 1), classes: currentPage== i + 1 ? 'is-active' : '' })
  }
  return result
}
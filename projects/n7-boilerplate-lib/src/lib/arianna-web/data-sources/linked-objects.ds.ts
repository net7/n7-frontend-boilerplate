import { DataSource } from '@n7-frontend/core';

export class AwLinkedObjectsDS extends DataSource {

  public totalPages: number
  public currentPage: number
  public pageSize: number
  public context: string

  protected transform(data) {
    const CONFIG = this.options.config
    this.pageSize = this.options.size
    this.currentPage = Number(this.options.page)
    this.totalPages = Math.floor(data.length / Number(this.pageSize))
    this.context = this.options.context
    return unpackData(data, this.currentPage, this.pageSize, CONFIG, this.totalPages, this.context)
  }
}

function unpackData (data, page, size, config, totalPages, context) {
  const keys = config.get('config-keys')
  const lengthLimit = config.get('home-layout')['max-item-length']
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
      title:
        // if there is a max string length in config, use it
        lengthLimit && el.item.label.length > lengthLimit ?
        el.item.label.slice(0, lengthLimit) + '...' : el.item.label,
      payload: el.item.id,
      classes: context == 'entita' ? 'is-fullwidth' : '',
      metadata: [
        {
          classes: 'n7-objects__metadata-artist',
          items: [
            { // Artista: Mimmo Jodice
              // label: el.item.info[0].key,
              label: 'Autore',
              value: el.item.info[0] ? el.item.info[0].value : 'Sconosciuto'
            },
            {
              // olio su tela
              value: el.item.info[1] ? el.item.info[1].label : ''
            }
          ]
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
  if (context === 'home') {
    return {
      result,
      actions: [
        { label: 'Vedi Tutti 7805'},
        { label: 'Vedi Altri 7795'}
      ]
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
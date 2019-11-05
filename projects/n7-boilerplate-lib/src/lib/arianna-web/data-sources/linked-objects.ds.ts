import { DataSource } from '@n7-frontend/core';

export class AwLinkedObjectsDS extends DataSource {

  public currentPage: number
  public totalPages: number
  public pageSize: number
  public context: string

  protected transform(data) {
    this.pageSize = this.options.size
    this.currentPage = <number>this.options.page
    this.totalPages = Math.floor(data.length / this.pageSize)
    this.context = this.options.context
    return this.unpackData(data)
  }

  public handleShowMoreClick = incomingData => {
    /*
      Called by button <Mostra Altri>, adds the incoming
      data to the linked objects component.
    */
    console.log('showing more stuff')
    // TODO
  }

  public makePagination = (totalPages, currentPage) => {
    /*
      Called by this.unpackData() when this.options.page is defined.
      Returns the data for <n7-pagination> component.
    */
    let result = []
    // always push the first page
    result.push({
      text: '1',
      payload: 'page-1',
      classes: currentPage == 1 ? 'is-active' : ''
    })
    for (let i = 1; i < totalPages; i++) {
      result.push({ text: String(i + 1), payload: 'page-' + String(i + 1), classes: currentPage == i + 1 ? 'is-active' : '' })
    }
    return result
  }

  private unpackData = data => {
    /*
      Dynamically returns the data object for each HTML component
      data: {
        previews: [ breadcrumbs: { items[] }, classes, image, metadata, payload, title ],
        pagination: { first, last, links, next, prev, select }
      }
    */
    const
      config = this.options.config, // app-config.json
      totalCount = data.totalCount, // total amount of items available on backend
      totalPages = this.totalPages, // calculated number of pages
      page = this.currentPage,      // current page (if using pagination)
      context = this.context,       // parent layout name
      size = this.pageSize          // items per page (if using pagination)
    var
      d = data.items                // items to iterate over

    if (config) {
      var keys = config.get('config-keys')
      // dynamic search for max-item-length
      if (config.get(context + '-layout')) {
        var lengthLimit = config.get(context + '-layout')['max-item-length']
        var resultsLimit = config.get(context + '-layout')['results-limit']
      }
    }
    // resize data
    if (size && page) {
      d = d.slice(page * size - size, page * size)
    } else if (size) {
      d = d.slice(0, size)
    }

    var result = []
    d.forEach(el => {
      let item = {
        image: el.thumbnail,
        title:
          // if there is a max string length in config, use it
          lengthLimit && el.item.label.length > lengthLimit ?
            el.item.label.slice(0, lengthLimit) + '...' : el.item.label,
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
            items: el.relatedTypesOfEntity.map(toe => {
              return { // Persone: 6, Organizz: 12, Luoghi: 2, Concetti: 32
                value: toe.count,
                // icon: 'n7-icon-bell' // TODO: link icon to config key
                icon:  keys[toe.type] ? keys[toe.type].icon : "",
                classes: 'color-' + toe.type.configKey
              }
            })
          }
        ]
      };
      if (el.breadcrumbs) {
        item['breadcrumbs'] = { // n7-breadcrumbs uses this as it's own data
          items: el.breadcrumbs.map(crumb => {
            return {
              label: crumb.label,
              payload: crumb.link,
            }
          })
        };
      }
      result.push(item);
    });
    if (page) { // if I'm on a page, render pagination data.
      let sizeOptions = [10, 25, 50]
      return {
        pagination: {
          first: { payload: `goto-${1}`, classes: page == 1 ? 'is-disabled' : '' },
          prev: { payload: `goto-${page - 1}`, classes: page == 1 ? 'is-disabled' : '' },
          next: { payload: `goto-${page + 1}`, classes: page == totalPages ? 'is-disabled' : '' },
          last: { payload: `goto-${totalPages}`, classes: page == totalPages ? 'is-disabled' : '' },
          links: this.makePagination(totalPages, page),
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
        actions:
          [
            { label: 'Mostra Tutti (' + totalCount + ')' },
            lengthLimit ?
              { label: 'Mostra Altri (' + resultsLimit + ')' } :
              null,
          ]
      }
    }
    console.log('linked objects result', result)
    return result;
  }
}
import { DataSource } from '@n7-frontend/core';
import { LOADER_MOCK } from "@n7-frontend/components";

export class AwLinkedObjectsDS extends DataSource {

  public currentPage: number
  public totalPages: number
  public totalObjects: number
  public pageSize: number
  public context: string
  public loadedData: any
  public loadingData: boolean = false

  protected transform(data) {
    this.pageSize = this.options.size
    this.totalObjects = data.totalCount
    this.currentPage = this.options.page ? <number>this.options.page : 1
    this.totalPages = Math.floor(data.length / this.pageSize)
    this.context = this.options.context
    this.loadedData = this.unpackData(data)
    this.checkForMore() // checks if <Show More> button should be enabled
    this.loadedData.loaderData = LOADER_MOCK
    return this.loadedData
  }

  public checkForMore = (force?: boolean) => {
    /*
      Checks if it is possible to load more item previews.
      Can receive a boolean argument to force the button to be
      enabled or disabled. (Used while data is loading)
    */
    if (!this.loadedData.actions) {
      // if not using actions, don't check
      return
    }
    if (typeof force !== 'undefined') {
      this.loadedData.actions[1].disabled = !force
      return
    }
    if (this.loadedData.result.length >= this.totalObjects) {
      this.loadedData.actions[1].disabled = true
    } else {
      this.loadedData.actions[1].disabled = false
    }
    return
  }

  public handleIncomingData = incomingData => {
    /*
      Called by button <Mostra Altri>, adds the incoming
      data to the linked objects component.
    */
    this.currentPage += 1
    let newData: any = this.unpackData(incomingData.itemsPagination)
    this.loadedData.result = this.loadedData.result.concat(newData.result)
    this.checkForMore()
    this.loadedData.isLoading = false
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
            items: el.relatedTOEData.map(toe => {
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
    if (this.options.pagination) { // if I'm on a page, render pagination data.
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
      let actions = [
        {
          label: 'Mostra Tutti (' + totalCount + ')'
        },
        lengthLimit ?
          {
            label: 'Mostra Altri (' + resultsLimit + ')',
            disabled: false,
          } : null,
      ]
      return {
        result,
        actions,
        isLoading: false,
      }
    }
    return {previews: result};
  }
}
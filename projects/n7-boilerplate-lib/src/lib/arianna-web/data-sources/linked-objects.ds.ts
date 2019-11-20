import { DataSource } from '@n7-frontend/core';
import { get as _get } from "lodash" // used for cherry-picking object keys from app-config.json

export class AwLinkedObjectsDS extends DataSource {

  public currentPage: number
  public totalPages: number
  public totalObjects: number
  public pageSize: number
  public context: string
  public loadedData: any
  public loadingData: boolean = false
  public paths: any // use dynamic object paths from config

  protected transform(data) {
    this.paths = this.options.config.get('item-preview')
    this.pageSize = this.options.size
    this.totalObjects = data.totalCount
    this.currentPage = this.options.page ? <number>this.options.page : 1
    if (data.items) {
      this.totalPages = Math.ceil(data.items.length / this.pageSize)
    } else if (data.relatedItems) {
      this.totalPages = Math.ceil(data.relatedItems.length / this.pageSize)
    }
    this.context = this.options.context
    this.loadedData = this.unpackData(data)
    if (this.options.pagination) {
      this.addPagination(this.currentPage, this.totalPages, this.pageSize)
    }
    this.checkForMore() // checks if <Show More> button should be enabled
    this.loadedData.loaderData = {}
    console.log({ loadedData: this.loadedData })
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

  public addPagination = (page, totalPages, size) => {
    let sizeOptions = [10, 25, 50]
    this.loadedData.pagination = {
      first: { payload: `goto-${1}`, classes: page == 1 ? 'is-disabled' : '' },
      prev: { payload: `goto-${page / 1 - 1}`, classes: page == 1 ? 'is-disabled' : '' },
      next: { payload: `goto-${page / 1 + 1}`, classes: page == totalPages ? 'is-disabled' : '' },
      last: { payload: `goto-${totalPages}`, classes: page == totalPages ? 'is-disabled' : '' },
      links: this.makePagination(totalPages, page),
      select: {
        label: 'Numero di risultati',
        options: sizeOptions.map(o => {
          return {
            text: o,
            selected: o == size,
          }
        }),
        payload: 'select-size'
      },
      // previews: result
    }
  }

  public makePagination = (totalPages, currentPage) => {
    /*
      Called by this.unpackData() when this.options.page is defined.
      Returns the data for <n7-pagination> component.
    */
    let result = []
    let limit = this.paths.paginationLimit - 1
    // always push the first page
    if (limit) {
      let lastPage: number, firstPage: number
      if (currentPage > Math.floor(limit / 2)) {
        // when currentPage is after half-point
        // (example: [ 14 ][ 15 ][!16!][ 17 ][ 18 ])
        if (currentPage < (totalPages - Math.floor(limit / 2))) {
          lastPage = currentPage / 1 + Math.floor(limit / 2)
          firstPage = currentPage / 1 - Math.floor(limit / 2)
        } else {
          lastPage = totalPages
          firstPage = currentPage - limit + (totalPages - currentPage)
        }
      } else {
        // when currentPage is before half-point
        // (example: [ 1 ][!2!][ 3 ][ 4 ][ 5 ])
        lastPage = limit + 1
        firstPage = 1
      }
      // console.log({ currentPage, limit, lastPage, firstPage })
      for (let i = firstPage; i <= lastPage; i++) {
        result.push({
          text: String(i),
          payload: 'page-' + String(i),
          classes: currentPage == i ? 'is-active' : ''
        })
      }
    } else {
      result.push({
        text: '1',
        payload: 'page-1',
        classes: currentPage == 1 ? 'is-active' : ''
      })
      for (let i = 1; i < totalPages; i++) {
        result.push({ text: String(i + 1), payload: 'page-' + String(i + 1), classes: currentPage == i + 1 ? 'is-active' : '' })
      }
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
      config = this.options.config,       // app-config.json
      paths = config.get('item-preview'), // item preview dynamic paths
      totalCount = data.totalCount,       // total amount of items available on backend
      totalPages = this.totalPages,       // calculated number of pages
      page = this.currentPage,            // current page (if using pagination)
      context = this.context,             // parent layout name
      size = this.pageSize                // items per page (if using pagination)
    var
      d = data.items ? data.items : data.relatedItems // items to iterate over

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
        image: _get(el, paths.image, el.image),
        title:
          // if there is a max string length in config, use it
          +paths.title.maxLength && _get(el, paths.title, el.item.label).length > +paths.title.maxLength ?
            _get(el, paths.title, el.item.label).slice(0, +paths.title.maxLength) + '…' :
            _get(el, paths.title, el.item.label),
        text: !paths.text ? null : // make text block (in config) optional
          +paths.text.maxLength && _get(el, paths.text.data, el.item.text).length > +paths.text.maxLength ?
            _get(el, paths.text.data, el.item.text).slice(0, +paths.text.maxLength) + '…' :
            _get(el, paths.text.data, el.item.text),
        payload: _get(el, paths.payload, el.item.id),
        classes: ['entita', 'search'].includes(context) ? 'is-fullwidth' : '',
        metadata: [
          _get(el, paths.metadata.info.data, el.item.fields) ? {
            classes: 'n7-objects__metadata-artist',
            items: _get(el, paths.metadata.info.data, el.item.fields).map(data => {
              for (let i = 0; i < paths.metadata.info.selection.length; i++) {
                if (data.key == paths.metadata.info.selection[i].key) { // if the selected key (config) is in data, use it
                  return ({
                    label: paths.metadata.info.selection[i].forceLabel ? paths.metadata.info.selection[i].forceLabel : data.key,
                    value: data.value
                  })
                }
              }
              return {} // if no data was found for this key, return empty object.
            })
          } : {}, // if metadata.data is missing, use empty object
          {
            classes: 'n7-objects__metadata-linked',
            items: _get(el, paths.metadata.toe.data, el.relatedTypesOfEntity) ?
              _get(el, paths.metadata.toe.data, el.relatedTypesOfEntity).map(toe => {
                return { // persona: 6, Organizz: 12, Luoghi: 2, Concetti: 32
                  value: _get(toe, paths.metadata.toe.value, toe.count),
                  // icon: 'n7-icon-bell' // TODO: link icon to config key
                  icon: keys[_get(toe, paths.metadata.toe.icon, toe.type).replace(" ", "-")] ? keys[_get(toe, paths.metadata.toe.icon, toe.type).replace(" ", "-")].icon : "",
                  classes: 'color-' + _get(toe, paths.metadata.toe.icon, toe.type).replace(" ", "-")
                }
              }) : null
          }
        ]
      };
      if (_get(el, paths.metadata.breadcrumbs.data, el.breadcrumbs)) {
        item['breadcrumbs'] = { // n7-breadcrumbs uses this as it's own data
          items: _get(el, paths.metadata.breadcrumbs.data, el.breadcrumbs).map(crumb => {
            return {
              label: _get(crumb, paths.metadata.breadcrumbs.label, crumb.label),
              payload: _get(crumb, paths.metadata.breadcrumbs.payload, crumb.link),
            }
          })
        };
      }
      result.push(item);
    });
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
    return { previews: result };
  }
}
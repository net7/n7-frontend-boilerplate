import { DataSource } from '@n7-frontend/core';
import * as _ from "lodash"; // used for cherry-picking object keys from app-config.json

export class AwLinkedObjectsDS extends DataSource {

  public currentPage: number
  public totalPages: number
  public totalObjects: number
  public pageSize: number
  public context: string
  public loadedData: any
  public loadingData: boolean = false
  // public paths: any = this.options.paths // use dynamic object paths from config

  protected transform(data) {
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
    this.checkForMore() // checks if <Show More> button should be enabled
    this.loadedData.loaderData = {}
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
      config = this.options.config,       // app-config.json
      paths = config.get('item-preview'), // item preview dynamic paths
      totalCount = data.totalCount,       // total amount of items available on backend
      totalPages = this.totalPages,       // calculated number of pages
      page = this.currentPage,            // current page (if using pagination)
      context = this.context,             // parent layout name
      size = this.pageSize                // items per page (if using pagination)
    var
      d = data.items ? data.items : data.relatedItems                // items to iterate over

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
        image: _.get(el, paths.image, el.image),
        title:
          // if there is a max string length in config, use it
          lengthLimit && _.get(el, paths.title, el.item.label).length > lengthLimit ?
            _.get(el, paths.title, el.item.label).slice(0, lengthLimit) + '…' :
            _.get(el, paths.title, el.item.label),
        text:
          Number(paths.text.maxLength) && _.get(el, paths.text.data, el.item.text).length > Number(paths.text.maxLength) ?
            _.get(el, paths.text.data, el.item.text).slice(0, Number(paths.text.maxLength)) + '…' :
            _.get(el, paths.text.data, el.item.text),
        payload: _.get(el, paths.payload, el.item.id),
        classes: ['entita', 'search'].includes(context) ? 'is-fullwidth' : '',
        metadata: [
          _.get(el, paths.metadata.info, el.item.info) ? {
            classes: 'n7-objects__metadata-artist',
            items: _.get(el, paths.metadata.info, el.item.info).map(({ value, key }) => ({
              label: key === 'author' ? 'Artista' : null,
              value
            }))
          } : {},
          {
            classes: 'n7-objects__metadata-linked',
            items: _.get(el, paths.metadata.toe.data, el.relatedTypesOfEntity).map(toe => {
              return { // persona: 6, Organizz: 12, Luoghi: 2, Concetti: 32
                value: _.get(toe, paths.metadata.toe.value, toe.count),
                // icon: 'n7-icon-bell' // TODO: link icon to config key
                icon: keys[_.get(toe, paths.metadata.toe.icon, toe.type)] ? keys[_.get(toe, paths.metadata.toe.icon, toe.type)].icon : "",
                classes: 'color-' + _.get(toe, paths.metadata.toe.icon, toe.type)
              }
            })
          }
        ]
      };
      if (_.get(el, paths.metadata.breadcrumbs.data, el.breadcrumbs)) {
        item['breadcrumbs'] = { // n7-breadcrumbs uses this as it's own data
          items: _.get(el, paths.metadata.breadcrumbs.data, el.breadcrumbs).map(crumb => {
            return {
              label: _.get(crumb, paths.metadata.breadcrumbs.label, crumb.label),
              payload: _.get(crumb, paths.metadata.breadcrumbs.payload, crumb.link),
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
    return { previews: result };
  }
}
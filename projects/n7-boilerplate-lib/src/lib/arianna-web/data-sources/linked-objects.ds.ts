import { DataSource } from '@n7-frontend/core';
import helpers from '../../common/helpers';
import { get as _get } from 'lodash'; // used for cherry-picking object keys from app-config.json

export class AwLinkedObjectsDS extends DataSource {

  public currentPage: number;
  public totalPages: number;
  public totalObjects: number;
  public pageSize: number;
  public context: string;
  public loadedData: any;
  public loadingData = false;
  public paths: any; // use dynamic object paths from config

  protected transform(data) {
    this.paths = this.options.config.get('item-preview');
    this.pageSize = this.options.size;
    this.totalObjects = data.totalCount;
    this.currentPage = this.options.page ? +this.options.page : 1;
    if (this.options.dynamicPagination && this.options.dynamicPagination.total) {
      this.totalPages = Math.ceil(this.options.dynamicPagination.total / this.pageSize);
    } else if (data.items) {
      this.totalPages = Math.ceil(data.items.length / this.pageSize);
    } else if (data.relatedItems) {
      this.totalPages = Math.ceil(data.relatedItems.length / this.pageSize);
    }
    this.context = this.options.context;
    this.loadedData = this.unpackData(data);
    if (this.options.pagination) {
      this.addPagination(this.currentPage, this.totalPages, this.pageSize);
    }
    this.checkForMore(); // checks if <Show More> button should be enabled
    this.loadedData.loaderData = {};
    return this.loadedData;
  }

  public checkForMore = (force?: boolean) => {
    /*
      Checks if it is possible to load more item previews.
      Can receive a boolean argument to force the button to be
      enabled or disabled. (Used while data is loading)
    */
    if (!this.loadedData.actions) {
      // if not using actions, don't check
      return;
    }
    if (typeof force !== 'undefined') {
      this.loadedData.actions[1].disabled = !force;
      return;
    }
    if (this.loadedData.result.length >= this.totalObjects) {
      this.loadedData.actions[1].disabled = true;
    } else {
      this.loadedData.actions[1].disabled = false;
    }
    return;
  }

  public handleIncomingData = incomingData => {
    /*
      Called by infinite scroller, adds the incoming
      data to the linked objects component.
    */
    this.currentPage += 1;
    const newData: any = this.unpackData(incomingData.itemsPagination);
    this.loadedData.result = this.loadedData.result.concat(newData.result);
    this.checkForMore();
    this.loadedData.isLoading = false;
  }

  public addPagination = (page, totalPages, size) => {
    const sizeOptions = [10, 25, 50];
    this.loadedData.pagination = {
      first: { payload: `goto-${1}`, classes: page === 1 ? 'is-disabled' : '' },
      prev: { payload: `goto-${page / 1 - 1}`, classes: page === 1 ? 'is-disabled' : '' },
      next: { payload: `goto-${page / 1 + 1}`, classes: page === totalPages ? 'is-disabled' : '' },
      last: { payload: `goto-${totalPages}`, classes: page === totalPages ? 'is-disabled' : '' },
      links: this.makePagination(totalPages, page),
      select: {
        label: 'Numero di risultati',
        options: sizeOptions.map(o => {
          return {
            text: o,
            selected: o === size,
          };
        }),
        payload: 'select-size'
      },
      // previews: result
    };
  }

  public makePagination = (totalPages, currentPage) => {
    /*
      Called by this.unpackData() when this.options.page is defined.
      Returns the data for <n7-pagination> component.
    */
    const result = [];
    let limit = this.paths.paginationLimit - 1;

    if (totalPages <= limit) {
      limit = totalPages - 1;
    }

    // always push the first page
    if (limit) {
      let lastPage: number, firstPage: number;
      if (currentPage > Math.floor(limit / 2)) {
        if (totalPages === 2) {
          lastPage = totalPages;
          firstPage = 1;
          // when currentPage is after half-point
          // (example: [ 14 ][ 15 ][!16!][ 17 ][ 18 ])
        } else if (currentPage < (totalPages - Math.floor(limit / 2))) {
          lastPage = currentPage / 1 + Math.floor(limit / 2);
          firstPage = currentPage / 1 - Math.floor(limit / 2);
        } else {
          lastPage = totalPages;
          firstPage = currentPage - limit + (totalPages - currentPage);
        }
      } else {
        // when currentPage is before half-point
        // (example: [ 1 ][!2!][ 3 ][ 4 ][ 5 ])
        lastPage = limit + 1;
        firstPage = 1;
      }

      for (let i = firstPage; i <= lastPage; i++) {
        result.push({
          text: String(i),
          payload: 'page-' + String(i),
          classes: currentPage === i ? 'is-active' : ''
        });
      }
    } else {
      result.push({
        text: '1',
        payload: 'page-1',
        classes: currentPage === 1 ? 'is-active' : ''
      });
      for (let i = 1; i < totalPages; i++) {
        result.push({ text: String(i + 1), payload: 'page-' + String(i + 1), classes: currentPage === i + 1 ? 'is-active' : '' });
      }
    }
    return result;
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
      size = this.pageSize,               // items per page (if using pagination)
      labels = config.get('labels'),
      { dynamicPagination } = this.options,
      keys = config ? config.get('config-keys') : {};
    let
      lengthLimit: null,
      resultsLimit: null,
      d = data.items ? data.items : data.relatedItems; // items to iterate over

    if (config) {
      // dynamic search for max-item-length
      if (config.get(context + '-layout')) {
        lengthLimit = config.get(context + '-layout')['max-item-length'];
        resultsLimit = config.get(context + '-layout')['results-limit'];
      }
    }
    // resize data
    if (!dynamicPagination && size && page) {
      d = d.slice(page * size - size, page * size);
    } else if (size) {
      d = d.slice(0, size);
    }

    const result = [];
    const enabledKeys = paths.metadata.info.selection.map(info => info.key);
    d.forEach(el => {
      const infoData = _get(el, paths.metadata.info.data, el.item.fields),
        infoDataItems = infoData ? infoData.filter(data => enabledKeys.indexOf(data.key) !== -1) : [],
        toeData = _get(el, paths.metadata.toe.data, el.relatedTypesOfEntity),
        breadcrumbs = _get(el, paths.metadata.breadcrumbs.data, el.breadcrumbs);

        if( ['entita', 'search'].includes(context) ){
          if( el.item.typeOfEntity && el.item.typeOfEntity != "" ) {
            infoDataItems.push({"key": "Tipo di entità", "value": keys[el.item.typeOfEntity]['singular-label']})
          }
        }
        let classes = ['entita', 'search'].includes(context) ? 'is-fullwidth' : '';
        classes += el.item.typeOfEntity ? " is-" + el.item.typeOfEntity.replace(/ /g, '-') : " is-oggetto-culturale";

        const itemTitle = +paths.title.maxLength && _get(el, paths.title, el.item.label).length > +paths.title.maxLength
          ? _get(el, paths.title, el.item.label).slice(0, +paths.title.maxLength) + '…'
          : _get(el, paths.title, el.item.label),
          item = {
            image: _get(el, paths.image, el.image),
            title: itemTitle,
            text: !paths.text ? null : // make text block (in config) optional
              +paths.text.maxLength && _get(el, paths.text.data, el.item.text).length > +paths.text.maxLength ?
                _get(el, paths.text.data, el.item.text).slice(0, +paths.text.maxLength) + '…' :
                _get(el, paths.text.data, el.item.text),
            payload: { id: _get(el, paths.payload, el.item.id), type: el.item.typeOfEntity, title: itemTitle },
            classes: classes,
            metadata: infoDataItems.length || toeData ? [] : null,
            breadcrumbs: null
          };
      // metadata
      if (infoDataItems.length) {
        item.metadata.push({
          classes: 'n7-objects__metadata-artist',
          items: infoDataItems.map(data => ({
            label: helpers.prettifySnakeCase(data.key, labels[data.key]),
            value: data.value
          }))
        });
      }
      if (toeData) {
        item.metadata.push({
          classes: 'n7-objects__metadata-linked',
          items: toeData.map(toe => {
            return { // persona: 6, Organizz: 12, Luoghi: 2, Concetti: 32
              value: _get(toe, paths.metadata.toe.value, toe.count),
              // icon: 'n7-icon-bell' // TODO: link icon to config key
              icon: keys[
                _get(toe, paths.metadata.toe.icon, toe.type).replace(' ', '-')]
                ? keys[_get(toe, paths.metadata.toe.icon, toe.type).replace(' ', '-')].icon
                : '',
              classes: 'color-' + _get(toe, paths.metadata.toe.icon, toe.type).replace(' ', '-')
            };
          })
        });
      }
      // breadcrumbs
      if (breadcrumbs) {
        item['breadcrumbs'] = { // n7-breadcrumbs uses this as it's own data
          items: _get(el, paths.metadata.breadcrumbs.data, el.breadcrumbs).map(crumb => {
            return {
              label: _get(crumb, paths.metadata.breadcrumbs.label, crumb.label),
              payload: _get(crumb, paths.metadata.breadcrumbs.payload, crumb.link),
            };
          })
        };
      }
      result.push(item);
    });
    if (context === 'home') {
      const actions = [
        {
          label: 'Mostra Tutti (' + totalCount + ')'
        },
        lengthLimit ?
          {
            label: 'Mostra Altri (' + resultsLimit + ')',
            disabled: false,
          } : null,
      ];
      return {
        result,
        actions,
        isLoading: false,
        fallback: config.get('home-layout')['linked-objects-fallback']
      };
    }
    return { previews: result };
  }
}

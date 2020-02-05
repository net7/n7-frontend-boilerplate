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

      const itemData = el.item ? el.item : el;

      const infoData = _get(el, paths.metadata.info.data, itemData.fields),
        infoDataItems = infoData ? infoData.filter(data => enabledKeys.indexOf(data.key) !== -1) : [],
        toeData = _get(el, paths.metadata.toe.data, itemData.relatedTypesOfEntity),
        breadcrumbs = _get(el, paths.metadata.breadcrumbs.data, itemData.breadcrumbs);

        if( ['entita', 'search'].includes(context) ){
          if( itemData.typeOfEntity && itemData.typeOfEntity != "" ) {
            infoDataItems.push({"key": "Tipo di entità", "value": keys[itemData.typeOfEntity]['singular-label']})
          }
        }
        let classes = ['entita', 'search', 'oggetti-collegati'].includes(context) ? 'is-fullwidth' : '';
        classes += itemData.typeOfEntity ? ' is-' + config.get('config-keys')[itemData.typeOfEntity]['class-name'] : ' is-oggetto-culturale';

        const itemTitle = +paths.title.maxLength && _get(el, paths.title, itemData.label).length > +paths.title.maxLength
          ? _get(el, paths.title, itemData.label).slice(0, +paths.title.maxLength) + '…'
          : _get(el, paths.title, itemData.label),
          itemId = _get(el, paths.payload, itemData.id),
          itemType = itemData.typeOfEntity,
          itemHref = [
            itemType ? config.get('paths').entitaBasePath : config.get('paths').schedaBasePath,
            itemId,
            helpers.slugify(itemTitle)
          ].join('/'),
          item = {
            image: _get(el, paths.image, itemData.image),
            title: itemTitle,
            text: !paths.text ? null : // make text block (in config) optional

              +paths.text.maxLength && _get(el, paths.text.data, itemData.text).length > +paths.text.maxLength ?
                _get(el, paths.text.data, itemData.text).slice(0, +paths.text.maxLength) + '…' :
                _get(el, paths.text.data, itemData.text),
            anchor: {
              href: itemHref
            },
            // payload: { id: _get(el, paths.payload, el.item.id), type: el.item.typeOfEntity, title: itemTitle },
            classes: classes,
            metadata: infoDataItems.length || toeData ? [] : null,
            breadcrumbs: breadcrumbs
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
              icon: keys[_get(toe, paths.metadata.toe.icon, toe.type)]
                ? keys[_get(toe, paths.metadata.toe.icon, toe.type)].icon
                : '',
              classes: 'color-' + keys[_get(toe, paths.metadata.toe.icon, toe.type)]['class-name']
            };
          })
        });
      }
      // breadcrumbs
      if (breadcrumbs) {
        item['breadcrumbs'] = { // n7-breadcrumbs uses this as it's own data
          items: _get(el, paths.metadata.breadcrumbs.data, el.item.breadcrumbs).map(crumb => {
            const label = _get(crumb, paths.metadata.breadcrumbs.label, crumb.label);
            return {
              label,
              anchor: {
                href: itemHref
              }
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

  private _getPaginationAnchor(page){
    const { href, queryParams } = this.options.paginationParams;
    return {
      href: queryParams ? href : href + page,
      queryParams: queryParams ? {
        ...queryParams,
        page: page
      } : null
    };
  }
}

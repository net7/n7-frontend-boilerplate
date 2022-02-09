import { DataSource } from '@net7/core';
import { get as _get } from 'lodash'; // used for cherry-picking object keys from app-config.json
import { helpers } from '@net7/boilerplate-common';

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
    }

  public handleIncomingData = (incomingData) => {
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

  /**
   * Dynamically returns the data object for each HTML component
   *  data: {
   *     previews: [ breadcrumbs: { items[] }, classes, image, metadata, payload, title ],
   *     pagination: { first, last, links, next, prev, select }
   *   }
   */
  private unpackData = (data) => {
    const
      { config } = this.options; // app-config.json
    const paths = config.get('item-preview'); // item preview dynamic paths
    const { totalCount } = data; // total amount of items available on backend
    const page = this.currentPage; // current page (if using pagination)
    const { context } = this; // parent layout name
    const size = this.pageSize; // items per page (if using pagination)
    const labels = config.get('labels');
    const { dynamicPagination } = this.options;
    const keys = config ? config.get('config-keys') : {};
    let
      lengthLimit: null;
    let resultsLimit: null;
    let d = data.items ? data.items : data.relatedItems; // items to iterate over
    if (config) {
      // dynamic search for max-item-length
      if (config.get(`${context}-layout`)) {
        lengthLimit = config.get(`${context}-layout`)['max-item-length'];
        resultsLimit = config.get(`${context}-layout`)['results-limit'];
      }
    }
    // resize data if necessary
    if (!dynamicPagination && size && page && d.length > size) {
      d = d.slice(page * size - size, page * size);
    } else if (size) {
      d = d.slice(0, size);
    }

    const result = [];
    const enabledKeys = paths.metadata.info.selection.map((info) => info.key);
    d.forEach((el) => {
      const itemData = el.item ? el.item : el;

      const infoData = _get(el, paths.metadata.info.data, itemData.fields);
      const toeData = _get(el, paths.metadata.toe.data, itemData.relatedTypesOfEntity);
      const breadcrumbs = _get(el, paths.metadata.breadcrumbs.data, itemData.breadcrumbs);
      let infoDataItems = infoData
        ? infoData.filter((info) => enabledKeys.indexOf(info.key) !== -1)
        : [];

      // order metadata
      infoDataItems = infoDataItems.map((info) => ({
        ...info,
        order: enabledKeys.indexOf(info.key)
      }));
      infoDataItems.sort((a, b) => a.order - b.order);

      if (['entita', 'search', 'gallery'].includes(context)) {
        if (itemData.typeOfEntity && itemData.typeOfEntity !== '') {
          infoDataItems.push({ key: 'Tipo di entità', value: keys[itemData.typeOfEntity]['singular-label'] });
        }
      }
      let classes = ['entita', 'search', 'oggetti-collegati'].includes(context) ? 'is-fullwidth' : '';
      classes += itemData.typeOfEntity ? ` is-${config.get('config-keys')[itemData.typeOfEntity]['class-name']}` : ' is-oggetto-culturale';

      // gallery classes
      if (context === 'gallery') {
        classes += ' is-vertical has-image';
      }

      // consider the lenght of <em> tags to exclude from count
      const highlights = _get(el, paths.title, itemData.label).match(/<em>/g) ? _get(el, paths.title, itemData.label).match(/<em>/g).length * 9 : 0;

      const itemTitle = +paths.title.maxLength
        && _get(el, paths.title, itemData.label).length > +paths.title.maxLength + highlights
        ? `${_get(el, paths.title, itemData.label).slice(0, +paths.title.maxLength + highlights)}…`
        : _get(el, paths.title, itemData.label);
      const itemId = _get(el, paths.payload, itemData.id);
      const itemType = itemData.typeOfEntity;
      const itemHref = [
        itemType ? config.get('paths').entitaBasePath : config.get('paths').schedaBasePath,
        itemId,
        helpers.slugify(itemTitle),
      ].join('/');
      let text;
      if (!paths.text) {
        text = null;
      } else if (
        +paths.text.maxLength
        && _get(el, paths.text.data, itemData.text).length > +paths.text.maxLength
      ) {
        text = `${_get(el, paths.text.data, itemData.text).slice(0, +paths.text.maxLength)}…`;
      } else {
        text = _get(el, paths.text.data, itemData.text);
      }
      const item = {
        text,
        classes,
        breadcrumbs,
        image: _get(el, paths.image, itemData.image),
        title: itemTitle,
        anchor: {
          href: itemHref,
          target: ['gallery', 'search'].includes(context) ? '_blank' : '_self'
        },
        relation: { key: el.relationName, value: el.relation },
        metadata: infoDataItems.length || toeData ? [] : null,
      };
      // metadata
      if (infoDataItems.length) {
        item.metadata.push({
          classes: 'aw-item-preview_metadata',
          items: infoDataItems.map((infoDItem) => ({
            label: helpers.prettifySnakeCase(infoDItem.key, labels[infoDItem.key]),
            value: infoDItem.value,
          })),
        });
      }
      if (toeData) {
        item.metadata.push({
          classes: 'aw-item-preview-entities',
          items: toeData.map((toe) => ({ // persona: 6, Organizz: 12, Luoghi: 2, Concetti: 32
            value: _get(toe, paths.metadata.toe.value, toe.count),
            // icon: 'n7-icon-bell' // TODO: link icon to config key
            icon: keys[_get(toe, paths.metadata.toe.icon, toe.type)]
              ? keys[_get(toe, paths.metadata.toe.icon, toe.type)].icon
              : '',
            classes: `color-${keys[_get(toe, paths.metadata.toe.icon, toe.type)]['class-name']}`,
          })),
        });
      }
      // breadcrumbs
      if (breadcrumbs) {
        item.breadcrumbs = { // n7-breadcrumbs uses this as it's own data
          items: _get(el, paths.metadata.breadcrumbs.data, el.item.breadcrumbs).map((crumb) => {
            const label = _get(crumb, paths.metadata.breadcrumbs.label, crumb.label);
            return {
              label,
              anchor: {
                href: itemHref,
              },
            };
          }),
        };
      }
      result.push(item);
    });
    if (context === 'home') {
      const actions = [
        {
          label: `Mostra Tutti (${totalCount})`,
        },
        lengthLimit
          ? {
            label: `Mostra Altri (${resultsLimit})`,
            disabled: false,
          } : null,
      ];
      return {
        result,
        actions,
        isLoading: false,
        fallback: config.get('home-layout')['linked-objects-fallback'],
      };
    }
    return { previews: result };
  }
}

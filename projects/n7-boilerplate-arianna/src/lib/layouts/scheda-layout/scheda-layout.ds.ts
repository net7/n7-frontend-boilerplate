import { LayoutDataSource } from '@net7/core';
import {
  fromEvent, Subject, of, merge, Observable
} from 'rxjs';
import {
  delay, first, takeUntil
} from 'rxjs/operators';
import { clone, get as _get } from 'lodash';
import { helpers } from '@net7/boilerplate-common';
import { Params } from '@angular/router';
import metadataHelper from '../../helpers/metadata.helper';
import nodeHelper from '../../helpers/node.helper';

const LOCAL_STORAGE_PREFIX = 'aw.scheda';

export class AwSchedaLayoutDS extends LayoutDataSource {
  static tree: any = null;

  private destroyed$: Subject<any> = new Subject();

  private stickyControlTrigger$: Subject<any> = new Subject();

  private communication: any;

  protected configuration: any;

  protected mainState: any;

  protected router: any;

  protected titleService: any;

  public options: any;

  private layoutConfig;

  public pageTitle: string;

  public hasBreadcrumb: boolean;

  public contentParts: any = {};

  public tree: any;

  public sidebarCollapsed: boolean;

  public relatedEntitiesHeader: string;

  public similarItemsSectionTitle: string;

  public metadataSectionTitle: string;

  public hasMetadata: boolean;

  public hasRelatedEntities: boolean;

  public hasSimilarItems: boolean;

  public hasExtendedTree: boolean;

  public hasInternalSearch: boolean;

  public hasDigitalObjects: boolean;

  public digitalObjects: any;

  public currentDigitalObject: any;

  public currentDigitalObjectIndex: number;

  public imageViewerIstance: any;

  public sidebarIsSticky = false;

  public treeMaxHeight = '100%';

  public contentIsLoading = false;

  public currentId: string | null = null;

  public emptyLabel: string;

  /** Switch loaded-content and loaded-empty states */
  public hasContent = true;

  /** String to render in the loaded-empty state */
  public emptyStateString: string;

  public externalUrlText: string;

  public hasContextMenu: () => boolean;

  public extendedTreeParams: {
    [key: string]: string;
  } = {};

  public internalSearchParams: {
    [key: string]: string;
  } = {};

  public lastResponse;

  /** Name of query that should be used (chosen in config) */
  private getTreeQuery: 'getTree' | 'getTreeLite' = 'getTree';

  public titleNavigation: {
    prev: { href: string; label: string; };
    next: { href: string; label: string; };
  } = null;

  public sectionCollapseState = {
    metadata: false,
    'extended-tree': false,
    'similar-items': false,
    'related-entities': false
  };

  public documentType: {
    icon: string;
    label: string;
  } = null;

  onInit({
    configuration, mainState, router, options, titleService, communication,
  }) {
    if (configuration) {
      this.configuration = configuration;
      this.layoutConfig = this.configuration.get('scheda-layout');
    }
    this.mainState = mainState;
    this.router = router;
    this.titleService = titleService;
    this.communication = communication;
    this.options = options;
    if (!this.sidebarCollapsed) {
      this.sidebarCollapsed = this.layoutConfig.tree.collapsedByDefault ?? false;
    }
    this.relatedEntitiesHeader = this.layoutConfig['related-entities'].title;
    this.similarItemsSectionTitle = this.layoutConfig['related-items'].title;
    this.externalUrlText = this.layoutConfig['external-url-text'];
    this.metadataSectionTitle = this.getMetadataSectionTitle();
    this.hasSimilarItems = false;
    this.one('aw-chart-tippy').updateOptions({
      basePath: this.configuration.get('paths').entitaBasePath,
    });
    this.emptyLabel = this.layoutConfig['empty-label'];
    this.emptyStateString = this.layoutConfig['empty-html'];
    this.one('aw-tree').updateOptions({ config: this.configuration.get('config-keys') });

    // switch the tree query to the slim version
    if (this.layoutConfig?.tree?.lite) {
      this.getTreeQuery = 'getTreeLite';
    }

    this.mainState.update('headTitle', 'Arianna4View - Patrimonio');
    this.mainState.update('pageTitle', 'Arianna4View - Patrimonio');
    this.mainState.updateCustom('currentNav', 'patrimonio');

    // image viewer context-menu check
    const imageViewerConfig = this.configuration.get('scheda-layout')['image-viewer'] || {};
    this.hasContextMenu = () => !!imageViewerConfig['context-menu'];

    // pdf viewer options
    this.one('aw-scheda-pdf').updateOptions(this.configuration.get('scheda-layout')['pdf-viewer'] || {});

    // check section collapse state
    Object.keys(this.sectionCollapseState).forEach((key) => {
      const storageKey = `${LOCAL_STORAGE_PREFIX}.${key}`;
      const storageValue = localStorage.getItem(storageKey);
      this.sectionCollapseState[key] = storageValue ? JSON.parse(storageValue) : false;
    });

    // sidebar sticky control
    this._sidebarStickyControl();
  }

  onDestroy() {
    this.destroyed$.next();
  }

  getMetadataSectionTitle() {
    const layoutConfig = this.configuration.get('scheda-layout');
    const metadataConfig = layoutConfig.metadata || {};
    return metadataConfig.title || null;
  }

  getNavigation() {
    if (AwSchedaLayoutDS.tree) {
      return of(AwSchedaLayoutDS.tree);
    }
    return this.communication.request$(this.getTreeQuery, {
      onError: (error) => console.error(error),
      params: {
        onlyAl: !!this.layoutConfig['extended-tree']
      },
    });
  }

  setTree(tree) {
    AwSchedaLayoutDS.tree = tree;
  }

  getTree = () => AwSchedaLayoutDS.tree;

  updateNavigation(text) {
    this.one('aw-sidebar-header').update({ text, isExpanded: !this.sidebarCollapsed });
  }

  loadItem(id) {
    const maxSimilarItems = this.configuration.get('scheda-layout')['related-items']['max-related-items'];
    return this.communication.request$('getNode', {
      onError: (error) => console.error(error),
      params: { id, maxSimilarItems },
    });
  }

  /**
   * Loads the content of the selected tree item in the right portion of the view.
   * @param response http response for the tree item
   */
  loadContent(response) {
    this.lastResponse = response;
    if (response) {
      // reset
      this.currentDigitalObject = null;
      this.currentDigitalObjectIndex = null;

      const metadataFields = this.getFields(response);
      this.hasMetadata = !!(Array.isArray(metadataFields) && metadataFields.length);
      this.hasSimilarItems = (
        !this.layoutConfig['extended-tree']
        && Array.isArray(response.relatedItems)
        && response.relatedItems.length
      );
      this.hasBreadcrumb = Array.isArray(response.breadcrumbs) && response.breadcrumbs.length;
      this.hasDigitalObjects = (
        Array.isArray(response.digitalObjects)
        && response.digitalObjects.length
      );
      this.hasRelatedEntities = (
        Array.isArray(response.relatedEntities)
        && response.relatedEntities.length
      );
      this.hasContent = !!(
        this.hasMetadata
        || this.hasSimilarItems
        || this.hasRelatedEntities
        || this.hasDigitalObjects
      );

      this.contentParts = [];
      const content = { content: null };

      if (response.text) {
        content.content = response.text;
      }
      this.contentParts.push(content);

      // digital objects
      if (this.hasDigitalObjects) {
        response.digitalObjects = this.normalizeDigitalObjects(response.digitalObjects);
        // this.one('aw-scheda-digital-objects').update(response.digitalObjects);
        this.one('aw-scheda-dropdown').update(response);
        this.digitalObjects = response.digitalObjects;
        this.changeDigitalObject(0);
      }

      const titleObj = {
        icon: response.icon,
        title: {
          main: {
            text: response.title || response.label,
            classes: 'bold',
          },
        },
        tools: response.subTitle,
        actions: {},
      };

      this.one('aw-scheda-inner-title').update(titleObj);
      this.one('aw-scheda-metadata').update(metadataFields);

      // Breadcrumb section
      const breadcrumbs = {
        items: [],
      };

      if (response.breadcrumbs) {
        response.breadcrumbs.forEach((element) => {
          breadcrumbs.items.push({
            label: element.label,
            anchor: {
              href: [
                this.configuration.get('paths').schedaBasePath,
                `${element.link}/`,
                helpers.slugify(element.label),
              ].join(''),
            },
          });
        });
        this.one('aw-scheda-breadcrumbs').update(breadcrumbs);
      }

      // title prev / next navigation
      this.loadTitleNavigation();

      // document title type (icon, label)
      this.loadDocumentType();

      // update head title
      this.mainState.update('headTitle', `Arianna4View - Patrimonio - ${response.title || response.label}`);
    }

    if (response.relatedItems) {
      this.one('aw-linked-objects').updateOptions({ context: 'scheda', config: this.configuration });
      this.one('aw-linked-objects').update(response);
    }
    if (response.relatedEntities) {
      response.relatedEntities.forEach((el) => {
        const label = response.title || response.label;
        el.relationName = label.length > 30
          ? `${label.substr(0, 30)}... `
          : label;
      });
      this.one('aw-related-entities').updateOptions({
        context: 'scheda', config: this.configuration, list: 'relatedEntities', title: response.title
      });
      this.one('aw-related-entities').update(response.relatedEntities);
    }

    // control sticky
    setTimeout(() => {
      this.stickyControlTrigger$.next();
    });
  }

  loadExtendedTree() {
    const parentResponse = this.lastResponse;

    if (this.layoutConfig['extended-tree']) {
      const configKeys = this.configuration.get('config-keys');
      const widgetOptions = this.layoutConfig['extended-tree'];
      const params: any = {
        id: parentResponse.id,
        page: 1,
        limit: 10,
        query: null,
        ...this.extendedTreeParams,
      };
      const widgetParams = clone(params);

      // normalize params
      params.offset = (params.page - 1) * params.limit;
      delete params.page;

      const basePath = this.configuration.get('paths').schedaBasePath;
      const request$ = this.communication.request$('getNodeChildren', {
        params,
        onError: (error) => console.error(error),
      });
      request$.subscribe((nodesResponse) => {
        this.hasExtendedTree = (
          params.query
          || widgetParams.page > 1
          || !!nodesResponse?.items?.length
        );
        if (this.hasExtendedTree) {
          this.one('aw-extended-tree').updateOptions({
            basePath,
            configKeys,
            params: widgetParams,
            ...widgetOptions,
          });
          this.one('aw-extended-tree').update({
            parent: parentResponse,
            nodes: nodesResponse
          });

          // fix query input update
          if (params.query) {
            setTimeout(() => {
              const queryInput: HTMLInputElement = document
                .querySelector('.aw-extended-tree__header .n7-inner-title__search-bar');
              queryInput.value = params.query || '';
            });
          }
        }
      });
    } else {
      this.hasExtendedTree = false;
    }
  }

  loadInternalSearch() {
    const parentResponse = this.lastResponse;

    if (this.layoutConfig['internal-search']) {
      this.hasInternalSearch = true;
      const configKeys = this.configuration.get('config-keys');
      const widgetOptions = this.layoutConfig['internal-search'];
      const rawParams: any = {
        id: parentResponse.id,
        'search-page': 1,
        'search-limit': 10,
        'search-query': null,
        // ancestor: true,
        ...this.internalSearchParams,
      };

      // set params object without "search-" prefix
      const params: Params = {};
      Object.keys(rawParams).forEach((paramKey) => {
        params[paramKey.replace('search-', '')] = rawParams[paramKey];
      });

      const widgetParams = clone(params);

      // normalize params
      params.offset = (params.page - 1) * params.limit;
      delete params.page;

      const basePath = this.configuration.get('paths').schedaBasePath;
      let request$: Observable<any> = of(null);
      if (params.query) {
        request$ = this.communication.request$('getNodeChildren', {
          params,
          onError: (error) => console.error(error),
        });
      }

      request$.subscribe((nodesResponse) => {
        this.one('aw-scheda-search').updateOptions({
          basePath,
          configKeys,
          params: widgetParams,
          ...widgetOptions,
        });
        this.one('aw-scheda-search').update(nodesResponse);

        // fix query input update
        if (params['search-query']) {
          setTimeout(() => {
            const queryInput: HTMLInputElement = document
              .querySelector('.aw-scheda-search__input input[type="text"]');
            queryInput.value = params['search-query'] || '';
          });
        }
      });
    } else {
      this.hasInternalSearch = false;
    }
  }

  loadTitleNavigation() {
    // reset
    this.titleNavigation = null;

    const hasTitleNav = (
      !!this.layoutConfig['title-nav']?.enabled
      && this.lastResponse.document_type === 'oggetto-culturale'
    );
    if (!hasTitleNav) return;

    this.titleNavigation = { prev: null, next: null };
    const basePath = this.configuration.get('paths').schedaBasePath;
    ['prev', 'next'].forEach((key) => {
      const item = this.lastResponse[key];
      this.titleNavigation[key] = item
        ? {
          href: `${basePath}/${item.id}/${helpers.slugify(item.label)}`,
          label: item.label,
        } : null;
    });
  }

  loadDocumentType() {
    const configKeys = this.configuration.get('config-keys');
    const { document_type: type } = this.lastResponse;
    const icon = nodeHelper.getNodeIcon(configKeys, this.lastResponse);
    if (configKeys[type]) {
      this.documentType = {
        icon,
        label: configKeys[type]['singular-label']
      };
    } else {
      this.documentType = null;
    }
  }

  /**
   * Toggle between the tree's collapsed or expanded state.
   */
  collapseSidebar() {
    // overwrite the configuration to prevent unwanted changes to the tree state.
    this.layoutConfig.tree.collapsedByDefault = !this.layoutConfig.tree.collapsedByDefault;
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.getWidgetDataSource('aw-sidebar-header').toggleSidebar();
  }

  onSectionCollapse(id: string) {
    this.sectionCollapseState[id] = !this.sectionCollapseState[id];

    // update storage
    const storageKey = `${LOCAL_STORAGE_PREFIX}.${id}`;
    localStorage.setItem(storageKey, this.sectionCollapseState[id]);
  }

  private _sidebarStickyControl() {
    // no sticky for Internet Explorer
    if (helpers.browserIsIE()) {
      return;
    }
    const source$ = fromEvent(window, 'scroll');

    merge(source$, this.stickyControlTrigger$).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(() => {
      const windowTop = window.pageYOffset;
      const windowBottom = window.scrollY + window.innerHeight;
      const wrapper = document.getElementsByClassName('sticky-parent')[0] as HTMLElement;
      const wrapperTop = wrapper.offsetTop;
      const wrapperBottom = wrapperTop + wrapper.clientHeight;

      this.sidebarIsSticky = wrapperTop <= windowTop;

      // tree height control
      if (this.sidebarIsSticky && windowBottom < wrapperBottom) {
        this.treeMaxHeight = `${windowBottom - windowTop - 50}px`;
      } else if (this.sidebarIsSticky && windowBottom >= wrapperBottom) {
        this.treeMaxHeight = `${wrapperBottom - windowTop - 50}px`;
      } else if (windowBottom < wrapperBottom) {
        this.treeMaxHeight = `${windowBottom - wrapperTop - 50}px`;
      } else {
        this.treeMaxHeight = `${wrapperBottom - wrapperTop - 50}px`;
      }
    });
  }

  public getFields(response) {
    const {
      fields,
      document_type: dt,
      document_classification: dc
    } = response;
    const paths = this.configuration.get('paths');
    const labels = this.configuration.get('labels');
    const dcSegments = typeof dc === 'string' ? dc.split('.') : [];
    const dcLastSegment = dcSegments[dcSegments.length - 1];
    let metadataToShow = _get(this.configuration.get('scheda-layout'), 'metadata-to-show', {});
    metadataToShow = metadataToShow[dcLastSegment] || metadataToShow[dt] || [];

    return metadataHelper.normalize({
      fields,
      paths,
      labels,
      metadataToShow,
      type: dt
    });
  }

  public changeDigitalObject(payload) {
    if (this.currentDigitalObjectIndex !== payload) {
      // link check
      if (this.digitalObjects[payload].type === 'external' && this.currentDigitalObject) {
        window.open(this.digitalObjects[payload].url, '_blank');
      } else {
        // always reset image viewer
        const schedaImageDS = this.getWidgetDataSource('aw-scheda-image');
        schedaImageDS.reset();

        this.currentDigitalObjectIndex = payload;
        this.currentDigitalObject = this.digitalObjects[payload];
        if (this.currentDigitalObject.type.includes('images')) {
          if (schedaImageDS.hasInstance()) {
            schedaImageDS.updateImages(this.currentDigitalObject);
          } else {
            this.one('aw-scheda-image').update(this.currentDigitalObject);
          }

          // image viewer navigator
          const navigatorConfig = this.layoutConfig['image-viewer-nav'];
          if (navigatorConfig?.enabled) {
            schedaImageDS.instanceLoaded$.pipe(
              first(),
              delay(100) // waiting for viewer instance to update
            ).subscribe((viewer) => {
              this.one('aw-scheda-image-navigator').updateOptions(navigatorConfig);
              this.one('aw-scheda-image-navigator').update(viewer);
            });
          }
        } else if (this.currentDigitalObject.type === 'pdf') {
          this.one('aw-scheda-pdf').update(this.currentDigitalObject);
        }
      }
    }
  }

  private normalizeDigitalObjects(digitalObjects) {
    return digitalObjects.map(($do) => {
      if ($do.type.includes('images')) {
        return {
          id: 'scheda-layout-viewer',
          type: $do.type,
          label: $do.label,
          items: $do.items.map(({ url, iiifImages }) => ({
            url,
            iiifImages,
            type: $do.type,
          }))
        };
      }
      return $do;
    });
  }

  private _normalizeItems(items) {
    return items.map((singleItem) => ({ item: { ...singleItem } }));
  }
}

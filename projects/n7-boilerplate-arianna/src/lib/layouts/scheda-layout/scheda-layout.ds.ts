import { LayoutDataSource } from '@n7-frontend/core';
import {
  fromEvent, Subject, of, merge,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { get as _get } from 'lodash';
import { helpers } from '@net7/boilerplate-common';
import metadataHelper from '../../helpers/metadata.helper';

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

  /** Name of query that should be used (chosen in config) */
  private getTreeQuery: 'getTree' | 'getTreeLite' = 'getTree';

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

  getNavigation(id) {
    if (AwSchedaLayoutDS.tree) {
      return of(AwSchedaLayoutDS.tree);
    }
    return this.communication.request$(this.getTreeQuery, {
      onError: (error) => console.error(error),
      params: { treeId: id },
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
    if (response) {
      // reset
      this.currentDigitalObject = null;
      this.currentDigitalObjectIndex = null;

      const metadataFields = this.getFields(response);
      this.hasMetadata = !!(Array.isArray(metadataFields) && metadataFields.length);
      this.hasSimilarItems = Array.isArray(response.relatedItems) && response.relatedItems.length;
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

  /**
   * Toggle between the tree's collapsed or expanded state.
   */
  collapseSidebar() {
    // overwrite the configuration to prevent unwanted changes to the tree state.
    this.layoutConfig.tree.collapsedByDefault = !this.layoutConfig.tree.collapsedByDefault;
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.getWidgetDataSource('aw-sidebar-header').toggleSidebar();
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
          hasNavigation: $do.items.length > 1,
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
}

import { LayoutDataSource } from '@n7-frontend/core';
import {
  fromEvent, Subject, of, merge,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { get as _get } from 'lodash';
import helpers from '../../../common/helpers';
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

  public hasImage: boolean;

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

  onInit({
    configuration, mainState, router, options, titleService, communication,
  }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.router = router;
    this.titleService = titleService;
    this.communication = communication;
    this.options = options;
    this.sidebarCollapsed = false;
    this.relatedEntitiesHeader = this.configuration.get('scheda-layout')['related-entities'].title;
    this.similarItemsSectionTitle = this.configuration.get('scheda-layout')['related-items'].title;
    this.metadataSectionTitle = this.getMetadataSectionTitle();
    this.hasSimilarItems = false;
    this.one('aw-chart-tippy').updateOptions({
      basePath: this.configuration.get('paths').entitaBasePath,
    });
    this.emptyLabel = this.configuration.get('scheda-layout')['empty-label'];
    this.emptyStateString = this.configuration.get('scheda-layout')['empty-html'];
    this.one('aw-tree').updateOptions({ config: this.configuration.get('config-keys') });

    this.mainState.update('headTitle', 'Arianna4View - Patrimonio');
    this.mainState.update('pageTitle', 'Arianna4View - Patrimonio');
    this.mainState.updateCustom('currentNav', 'patrimonio');

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
    return this.communication.request$('getTree', {
      onError: (error) => console.error(error),
      params: { treeId: id },
    });
  }

  setTree(tree) {
    AwSchedaLayoutDS.tree = tree;
  }

  getTree = () => AwSchedaLayoutDS.tree;

  updateNavigation(text) {
    this.one('aw-sidebar-header').update({ text });
  }

  loadItem(id) {
    const maxSimilarItems = this.configuration.get('scheda-layout')['related-items']['max-related-items'];
    return this.communication.request$('getNode', {
      onError: (error) => console.error(error),
      params: { id, maxSimilarItems },
    });
  }

  loadContent(response) {
    if (response) {
      this.hasMetadata = Array.isArray(response.fields) && response.fields.length;
      this.hasSimilarItems = Array.isArray(response.relatedItems) && response.relatedItems.length;
      this.hasBreadcrumb = Array.isArray(response.breadcrumbs) && response.breadcrumbs.length;
      this.hasRelatedEntities = Array.isArray(response.relatedEntities)
        && response.relatedEntities.length;
      this.hasImage = !!response.image;
      this.hasContent = !!(this.hasMetadata || this.hasSimilarItems
        || this.hasRelatedEntities || this.hasImage);

      this.contentParts = [];
      const content = { content: null };

      if (response.text) {
        content.content = response.text;
      }
      this.contentParts.push(content);
      // image viewer
      if (response.images) {
        const viewerDataSource = this.getWidgetDataSource('aw-scheda-image');
        if (!viewerDataSource.hasInstance()) {
          this.one('aw-scheda-image').update(response);
        } else {
          viewerDataSource.updateImages(response);
        }
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
      this.one('aw-scheda-metadata').update(this.getFields(response));

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

  collapseSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
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
}

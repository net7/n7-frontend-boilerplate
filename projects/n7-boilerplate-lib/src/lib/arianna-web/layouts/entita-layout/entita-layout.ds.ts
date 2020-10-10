import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { Observable, of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { get as _get } from 'lodash';
import metadataHelper from '../../helpers/metadata.helper';

export class AwEntitaLayoutDS extends LayoutDataSource {
  protected configuration: any;

  protected mainState: any;

  protected router: any;

  protected titleService: any;

  protected route: any;

  public options: any;

  public pageTitle: string;

  public hasMetadataFields = false;

  public myResponse: any; // backend response object

  public selectedTab: string; // selected nav item

  public navHeader: any = {}; // nav-header (custom) data

  public currentId: string; // selected entity (url param)

  public currentSlug: string; // selected entity (url param)

  public currentPage: any; // pagination value (url param)

  public pageSize = 10; // linked objects page size

  // ===== BUBBLE CHART =====
  public bubblesSize = 10; // related entities (bubbles) page size

  public bubblesEnabled: boolean;

  // ========================
  private communication: any;

  public fallbackText = '';

  public loading = true;

  onInit({
    configuration, mainState, router, route, options, titleService, communication,
  }) {
    this.route = route;
    this.communication = communication;
    this.configuration = configuration;
    this.mainState = mainState;
    this.options = options;
    this.router = router;
    this.titleService = titleService;
    this.currentId = '';
    this.currentPage = +this.route.snapshot.queryParams.page;
    this.one('aw-related-entities').updateOptions({
      config: this.configuration,
    });

    // navigation update
    this.mainState.updateCustom('currentNav', 'entita');

    // update head title
    this.mainState.update('headTitle', 'Arianna4View - Entità');

    // one tab control
    this.oneTabControl();
  }

  oneTabControl() {
    const navDS = this.getWidgetDataSource('aw-entita-nav');
    navDS.out$
      .pipe(
        filter((output) => !!output)
      )
      .subscribe(({ items }) => {
        if (items.length === 1) {
          this.router.navigate([items[0].anchor.href], { replaceUrl: true });
        }
      });
  }

  public updateComponent = (id, data, options?) => {
    if (options) {
      this.one(id).updateOptions(options);
    }
    this.one(id).update(data);
  }

  drawPagination = () => {
    if (!this.getLinkedObjectItems()) return;
    const { href, queryParams } = this._getPaginationParams();
    this.one('n7-smart-pagination').updateOptions({
      mode: 'href',
      href,
      queryParams,
    });
    this.one('n7-smart-pagination').update({
      totalPages: Math.ceil(this.getLinkedObjectItems().length / this.pageSize),
      currentPage: this.currentPage,
      pageLimit: 5,
      sizes: {
        list: [10, 25, 50],
        active: this.pageSize,
      },
    });
  }

  handlePageNavigation = () => {
    /*
      Updates selected tab on tab change
    */
    if (!this.myResponse) {
      return;
    }
    const { href, queryParams } = this._getPaginationParams();
    this.drawPagination();
    this.one('aw-linked-objects').updateOptions({
      paginationParams: { href, queryParams },
      context: this.selectedTab,
      config: this.configuration,
      page: this.currentPage,
      pagination: true,
      size: this.pageSize,
    });
    this.one('aw-linked-objects').update({ items: this.getLinkedObjectItems() });
  }

  handleNavUpdate = (tab) => {
    this.selectedTab = tab;
    this.updateWidgets(this.myResponse);
    this.one('aw-linked-objects').updateOptions({
      context: this.selectedTab,
      config: this.configuration,
      page: this.currentPage,
      pagination: true,
      paginationParams: this._getPaginationParams(),
      size: this.pageSize,
    });
    this.one('aw-linked-objects').update({ items: this.getLinkedObjectItems() });
  }

  updateWidgets(data) {
    /*
      Updates the widgets on this layout, based on route
    */
    const selected = this.selectedTab;
    Object.keys(data).forEach((k) => {
      if (Array.isArray(data[k]) && data[k].length === 0) { data[k] = null; }
    });
    this.one('aw-entita-nav').update({
      data,
      selected,
      basePath: this.getNavBasePath(),
    });
    this.updateComponent('aw-entita-metadata-viewer', this.getFields(this.myResponse));
    this.one('aw-related-entities').update(this.myResponse.relatedEntities);
    this.drawPagination();
  }

  loadItem(id, slug, tab): Observable<any> {
    /*
      Loads the data for the selected nav item, into the adjacent text block.
    */
    this.loading = true;
    if (id && tab) {
      this.currentId = id; // store selected item from url
      this.currentSlug = slug; // store selected item from url
      this.selectedTab = tab; // store selected tab from url
      return this.communication.request$('getEntityDetails', {
        onError: (error) => console.error(error),
        params: { entityId: id, entitiesListSize: this.bubblesSize },
      }).pipe(
        // global metadata tab control
        tap(({ fields, typeOfEntity }) => {
          this.hasMetadataFields = !!metadataHelper.normalize({
            fields,
            paths: this.configuration.get('paths'),
            labels: this.configuration.get('labels'),
            metadataToShow: _get(this.configuration.get('entita-layout'), 'metadata-to-show', []),
            type: typeOfEntity
          }).length;
        })
      );
    }
    this.pageTitle = 'Entità Test';
    return of(null);
  }

  loadContent(res) {
    this.loading = false;
    const config = this.configuration.get('config-keys')[res.typeOfEntity];
    // console.log('(entita) Apollo responded with: ', { res })
    this.myResponse = res;
    this.navHeader = { // always render nav header
      icon: config ? config.icon : '',
      text: this.myResponse.label,
      color: config['class-name'],
    };
    this.one('aw-entita-nav').updateOptions({
      bubblesEnabled: this.bubblesEnabled,
      config: this.configuration.get('entita-layout'),
      hasMetadataFields: this.hasMetadataFields,
      labels: this.configuration.get('labels')
    });
    this.one('aw-entita-metadata-viewer').update(this.getFields(res));
    this.one('aw-linked-objects').updateOptions({
      context: this.selectedTab,
      config: this.configuration,
      page: this.currentPage,
      pagination: true,
      paginationParams: this._getPaginationParams(),
      size: this.pageSize,
    });
    this.getLinkedObjectItems().forEach((el) => {
      el.relationName = res.label.length > 30
        ? `${res.label.substr(0, 30)}... `
        : res.label;
    });
    res.relatedEntities.forEach((el) => {
      el.relationName = res.label.length > 30
        ? `${res.label.substr(0, 30)}... `
        : res.label;
    });
    this.one('aw-linked-objects').update({ items: this.getLinkedObjectItems() });
    this.one('aw-related-entities').update(res.relatedEntities);
    this.drawPagination();
    // fallback text
    if (!this.hasMetadataFields) {
      this.fallbackText = this.configuration.get('entita-layout').fallback;
    }
    // update head title
    this.mainState.update('headTitle', `Arianna4View - Entità - ${this.myResponse.label}`);
  }

  private _getPaginationParams() {
    return {
      href: [
        this.configuration.get('paths').entitaBasePath,
        `${this.currentId}/`,
        this.currentSlug,
        `/${this.selectedTab}/`,
      ].join(''),
      queryParams: {
        page: this.currentPage,
      },
    };
  }

  public getNavBasePath() {
    return [
      this.configuration.get('paths').entitaBasePath,
      `${this.currentId}/`,
      this.currentSlug,
    ].join('');
  }

  public getFields(response) {
    const { fields, typeOfEntity } = response;
    const paths = this.configuration.get('paths');
    const labels = this.configuration.get('labels');
    let metadataToShow = _get(this.configuration.get('entita-layout'), 'metadata-to-show', []);
    if (this.selectedTab === 'overview') {
      metadataToShow = _get(this.configuration.get('entita-layout'), 'overview.informazioni', []);
    }

    return metadataHelper.normalize({
      fields,
      paths,
      labels,
      metadataToShow,
      type: typeOfEntity
    });
  }

  private getLinkedObjectItems() {
    return this.selectedTab === 'fondi-collegati'
      ? this.myResponse.relatedLa
      : this.myResponse.relatedItems;
  }
}

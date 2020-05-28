import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { get as _get } from 'lodash';

export class AwEntitaLayoutDS extends LayoutDataSource {
  protected configuration: any;

  protected mainState: any;

  protected router: any;

  protected location: any;

  protected titleService: any;

  protected route: any;

  public options: any;

  public pageTitle: string;

  public showFields = false;

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

  onInit({
    configuration, mainState, router, route, location, options, titleService, communication,
  }) {
    this.route = route;
    this.communication = communication;
    this.configuration = configuration;
    this.mainState = mainState;
    this.options = options;
    this.router = router;
    this.location = location;
    this.titleService = titleService;
    this.currentId = '';
    this.currentPage = +this.route.snapshot.queryParams.page;
    this.bubblesEnabled = this.configuration.get('features-enabled') ? this.configuration.get('features-enabled').bubblechart : false;
    this.bubblesSize = this.configuration.get('entita-layout') ? this.configuration.get('entita-layout').entitiesQuerySize : this.bubblesSize;
    this.one('aw-bubble-chart').updateOptions({
      selectable: false,
      simple: true,
      config: this.configuration,
      limit: this.configuration.get('bubble-chart').bubbleLimit,
      smallChartSize: this.configuration.get('entita-layout').overview.smallChartSize,
    });
    this.one('aw-chart-tippy').updateOptions({
      basePath: this.configuration.get('paths').entitaBasePath,
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

  // DEPRECATED
  /* getNavigation(id) {
    // Requests data from communication provider
    return this.communication.request$('getEntityDetails', {
      onError: (error) => console.error(error),
      params: { entityId: id, entitiesListSize: this.bubblesSize },
    });
  } */

  drawPagination = () => {
    const { href, queryParams } = this._getPaginationParams();
    this.one('n7-smart-pagination').updateOptions({
      mode: 'href',
      href,
      queryParams,
    });
    this.one('n7-smart-pagination').update({
      totalPages: Math.ceil(this.myResponse.relatedItems.length / this.pageSize),
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
    this.one('aw-linked-objects').update({ items: this.myResponse.relatedItems });
  }

  handleNavUpdate = (tab) => {
    this.selectedTab = tab;
    this.updateWidgets(this.myResponse);
    if (tab === 'oggetti-collegati') {
      this.one('aw-linked-objects').updateOptions({
        context: this.selectedTab,
        config: this.configuration,
        page: this.currentPage,
        pagination: true,
        paginationParams: this._getPaginationParams(),
        size: this.pageSize,
      });
      this.one('aw-linked-objects').update({ items: this.myResponse.relatedItems });
    } else if (tab === 'overview') {
      this.one('aw-linked-objects').updateOptions({
        size: 3,
        config: this.configuration,
        context: 'entita',
      });
      this.one('aw-linked-objects').update({ items: this.myResponse.relatedItems });
    }
    if (tab === 'overview' || tab === 'entita-collegate') {
      setTimeout(() => { this.updateBubbes(this.myResponse.relatedEntities); }, 800);
    }
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
    this.updateComponent(
      'aw-entita-metadata-viewer',
      this.myResponse.fields,
      {
        typeOfEntity: this.myResponse.typeOfEntity,
        context: this.selectedTab,
        config: this.configuration,
        labels: this.configuration.get('labels'),
      },
    );
    this.drawPagination();
  }

  updateBubbes(data) {
    /*
      Helper function to update the graph
    */
    this.one('aw-bubble-chart').update(data);
  }

  loadItem(id, slug, tab): Observable<any> {
    /*
      Loads the data for the selected nav item, into the adjacent text block.
    */
    if (id && tab) {
      this.currentId = id; // store selected item from url
      this.currentSlug = slug; // store selected item from url
      this.selectedTab = tab; // store selected tab from url
      return this.communication.request$('getEntityDetails', {
        onError: (error) => console.error(error),
        params: { entityId: id, entitiesListSize: this.bubblesSize },
      });
    }
    this.pageTitle = 'Entità Test';
    return of(null);
  }

  loadContent(res) {
    const config = this.configuration.get('config-keys')[res.typeOfEntity];
    // console.log('(entita) Apollo responded with: ', { res })
    this.myResponse = res;
    const allowedOverviewMetadata = _get(this.configuration.get('entita-layout'), 'overview.campi', []);
    if (
      (res.fields || [])
        .filter((field) => allowedOverviewMetadata.includes(field.key)).length > 0
    ) {
      // look at the response array, filtered by configuration values.
      // if the filtered response has some values, show the fields section.
      this.showFields = true;
    } else {
      this.showFields = false;
    }
    this.navHeader = { // always render nav header
      icon: config ? config.icon : '',
      text: this.myResponse.label,
      color: config['class-name'],
    };
    this.one('aw-entita-nav').updateOptions({ bubblesEnabled: this.bubblesEnabled, config: this.configuration.get('entita-layout') });
    this.one('aw-entita-metadata-viewer').updateOptions({ context: this.selectedTab, labels: this.configuration.get('labels'), config: this.configuration });
    this.one('aw-entita-metadata-viewer').update(res.fields);
    if (this.selectedTab === 'oggetti-collegati') {
      this.one('aw-linked-objects').updateOptions({
        context: this.selectedTab,
        config: this.configuration,
        page: this.currentPage,
        pagination: true,
        paginationParams: this._getPaginationParams(),
        size: this.pageSize,
      });
    } else {
      this.one('aw-linked-objects').updateOptions({
        size: 3,
        config: this.configuration,
        context: 'entita',
      });
    }
    res.relatedItems.forEach((el) => {
      el.relationName = res.label.length > 30
        ? `${res.label.substr(0, 30)}... `
        : res.label;
    });
    this.one('aw-linked-objects').update({ items: res.relatedItems });
    this.drawPagination();
    // update head title
    this.mainState.update('headTitle', `Arianna4View - Entità - ${this.myResponse.label}`);
  }

  private _getPaginationParams() {
    return {
      href: [
        this.configuration.get('paths').entitaBasePath,
        `${this.currentId}/`,
        this.currentSlug,
        '/oggetti-collegati/',
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
}

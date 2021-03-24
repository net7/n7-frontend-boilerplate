import { LayoutDataSource } from '@n7-frontend/core';
import { Observable, of } from 'rxjs';
import {
  catchError, filter, first, tap
} from 'rxjs/operators';
import { get as _get } from 'lodash';
import { ActivatedRoute, Params, Router } from '@angular/router';
import metadataHelper from '../../helpers/metadata.helper';
import { EntitaLayoutResponse } from './entita-layout.types';

export class AwEntitaLayoutDS extends LayoutDataSource {
  protected configuration: any;

  protected mainState: any;

  protected router: Router;

  protected titleService: any;

  protected route: ActivatedRoute;

  public options: any;

  public pageTitle: string;

  public hasMetadataFields = false;

  public myResponse: EntitaLayoutResponse; // backend response object

  public selectedTab: string; // selected nav item

  public navHeader: any = {}; // nav-header (custom) data

  public currentId: string; // selected entity (url param)

  public currentSlug: string; // selected entity (url param)

  public currentPage = 1; // pagination value (url param)

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
    this.currentPage = +this.route.snapshot.queryParams.page || 1;
    this.one('aw-related-entities').updateOptions({
      config: this.configuration,
    });

    // navigation update
    this.mainState.updateCustom('currentNav', 'entita');

    // update head title
    this.mainState.update('headTitle', 'Arianna4View - Entità');

    // check if there is only one tab
    this.singleTabCheck();
  }

  singleTabCheck() {
    const navDS = this.getWidgetDataSource('aw-entita-nav');
    navDS.out$
      .pipe(
        filter((output) => !!output)
      )
      .subscribe(({ items }) => {
        // if there is only one tab
        // and there are no query params
        // navigate to the tab.
        if (items.length === 1 && !this.currentPage) {
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

  /**
   * Updates the pagination component
   */
  drawPagination = (totalItems, pageSize) => {
    if (!this.getLinkedObjectItems()) return;
    const { href, queryParams } = this._getPaginationURL();
    this.one('n7-smart-pagination').updateOptions({
      mode: 'href',
      href,
      queryParams,
    });
    this.one('n7-smart-pagination').update({
      totalPages: this.getPageCount(totalItems, pageSize),
      currentPage: +this.currentPage || 1,
      pageLimit: 5,
      sizes: {
        list: [10, 25, 50],
        active: +this.pageSize,
      },
    });
  }

  /**
   * Updates the selected tab on tab change
   */
  handlePageNavigation = () => {
    if (!this.myResponse) {
      return;
    }
    this.getEntityDetailsPage(this.myResponse.id, +this.currentPage, +this.pageSize)
      .pipe(first())
      .subscribe({
        // Await for network response
        next: (data) => {
          this.myResponse = data;
          const { href, queryParams } = this._getPaginationURL();
          // update layout state
          this.pageSize = queryParams.size;
          this.currentPage = queryParams.page;
          // update components
          this.drawPagination(this.getItemCount(), this.pageSize);
          this.one('aw-linked-objects').updateOptions({
            paginationParams: { href, queryParams },
            context: this.selectedTab,
            config: this.configuration,
            dynamicPagination: {
              total: this.getItemCount(),
            },
            page: queryParams.page,
            size: queryParams.size,
            pagination: true,
          });
          this.one('aw-linked-objects').update({ items: this.getLinkedObjectItems() });
        },
        error: (e) => catchError(e),
      });
  }

  handleNavUpdate = (tab) => {
    this.selectedTab = tab;
    this.updateWidgets(this.myResponse);
    this.one('aw-linked-objects').updateOptions({
      context: this.selectedTab,
      config: this.configuration,
      dynamicPagination: {
        total: this.getItemCount(),
      },
      page: this.currentPage,
      size: this.pageSize,
      pagination: true,
      paginationParams: this._getPaginationURL(),
    });
    this.one('aw-linked-objects').update({ items: this.getLinkedObjectItems() });
    // update the url with the correct page and size
    const queryParams: Params = {
      page: this.currentPage, size: this.pageSize,
    };
    this.router.navigate(
      [], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge'
      }
    );
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
    this.drawPagination(this.getItemCount(), this.pageSize);
  }

  /**
   * Given a page number and a list size, returns the data
   * for a single page of content.
   *
   * @param pageNumber Page number to load
   * @param pageSize How many items need to be loaded
   */
  getEntityDetailsPage(id, pageNumber: number, pageSize: number): Observable<any> {
    return this.communication.request$('getEntityDetails', {
      onError: (error) => console.error(error),
      params: {
        entityId: id,
        itemsPagination: { offset: (pageNumber || 1) * pageSize, limit: +pageSize },
        entitiesListSize: this.bubblesSize
      },
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

  /*
   * Loads the data for the selected nav item, into the adjacent text block.
   */
  loadItem(id, slug, tab): Observable<any> {
    this.loading = true;
    if (id && tab) {
      this.currentId = id; // store selected item from url
      this.currentSlug = slug; // store selected item from url
      this.selectedTab = tab; // store selected tab from url
      return this.getEntityDetailsPage(id, 1, this.pageSize);
    }
    this.pageTitle = 'Entità Test';
    return of(null);
  }

  loadContent(res) {
    this.loading = false;
    const config = this.configuration.get('config-keys')[res.typeOfEntity];
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
      dynamicPagination: {
        total: this.getItemCount(),
      },
      paginationParams: this._getPaginationURL(),
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
    // fallback text
    if (!this.hasMetadataFields) {
      this.fallbackText = this.configuration.get('entita-layout').fallback;
    }
    // update head title
    this.mainState.update('headTitle', `Arianna4View - Entità - ${this.myResponse.label}`);
  }

  private _getPaginationURL() {
    return {
      href: [
        this.configuration.get('paths').entitaBasePath,
        `${this.currentId}/`,
        this.currentSlug,
        `/${this.selectedTab}/`,
      ].join(''),
      queryParams: {
        page: this.currentPage || 1,
        size: this.pageSize,
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

  public getItemCount(): number {
    switch (this.selectedTab) {
      case 'fondi-collegati':
        return this.myResponse.relatedLaTotalCount;
      case 'oggetti-collegati':
        return this.myResponse.relatedItemsTotalCount;
      default:
        return 0;
    }
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

  /**
   * Calculates the total amount of pages
   *
   * @param items the number of records in the database
   * @param size the number of items shown on a page
   * @returns the total number of pages
   */
  private getPageCount(items: number, size: number) {
    return Math.floor(items / size);
  }
}

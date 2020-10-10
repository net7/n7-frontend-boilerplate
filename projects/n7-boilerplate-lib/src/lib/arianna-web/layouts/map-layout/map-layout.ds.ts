import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { Subject } from 'rxjs';

export class AwMapLayoutDS extends LayoutDataSource {
  protected configuration: any;

  protected mainState: any;

  protected router: any;

  protected location: any;

  protected titleService: any;

  protected route: any;

  public options: any;

  public pageTitle: string;

  private communication: any;

  private pageSize = 10;

  public loading$: Subject<boolean> = new Subject();

  private currentPage = 1;

  private relatedItems: any[];

  public total: number;

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
    this.mainState.update('headTitle', 'Arianna4View - Mappa');

    this.communication.request$('getMapObjects', {
      params: {
        field: 'fields.note_storiche'
      }
    }).subscribe((response) => {
      this.one('aw-map').update(response);
    });
  }

  onMarkerOpen({ id, label }) {
    // loading results
    this.loading$.next(true);
    this.communication.request$('getEntityDetails', {
      params: {
        entityId: id,
      }
    }).subscribe(({ relatedItems }) => {
      // clear loading
      this.loading$.next(false);

      this.relatedItems = relatedItems;
      this.total = relatedItems.length;
      let text = `${this.total} Oggetti culturali collegati a ${label}`;
      if (this.total === 1) {
        text = `${this.total} Oggetto culturale collegato a ${label}`;
      }

      this.one('aw-scheda-inner-title').update({
        title: {
          main: { text }
        }
      });

      // update items
      this.updateItems();

      // update pagination
      this.updatePagination();
    });
  }

  onMarkerClose() {
    // reset
    this.pageSize = 10;
    this.currentPage = 1;
    this.relatedItems = [];
    this.total = 0;
    this.one('aw-scheda-inner-title').update({
      title: {
        main: { text: '' }
      }
    });
    this.one('aw-linked-objects').update({ items: [] });
  }

  onPaginationChange({ value }) {
    this.pageSize = +value;
    this.updateItems();
    this.updatePagination();
  }

  onPaginationClick({ page }) {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.currentPage = page;
      this.updateItems();
      this.updatePagination();
    }
  }

  private updateItems() {
    this.one('aw-linked-objects').updateOptions({
      context: 'map',
      config: this.configuration,
      page: this.currentPage,
      pagination: true,
      size: this.pageSize,
    });
    this.one('aw-linked-objects').update({ items: this.relatedItems });
  }

  private updatePagination() {
    this.one('n7-smart-pagination').updateOptions({
      mode: 'payload'
    });
    this.one('n7-smart-pagination').update({
      totalPages: Math.ceil(this.total / this.pageSize),
      currentPage: this.currentPage,
      pageLimit: 5,
      sizes: {
        list: [10, 25, 50],
        active: this.pageSize,
      },
    });
  }
}

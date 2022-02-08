import { InnerTitleData } from '@n7-frontend/components';
import { LayoutDataSource } from '@n7-frontend/core';
import { BehaviorSubject } from 'rxjs';
import { helpers } from '@net7/boilerplate-common';

type LayoutState = 'LOADING' | 'EMPTY' | 'SUCCESS';

export class AwMapLayoutDS extends LayoutDataSource {
  protected configuration: any;

  protected mainState: any;

  protected titleService: any;

  public options: any;

  public pageTitle: string;

  private communication: any;

  private pageSize = 10;

  public state$: BehaviorSubject<LayoutState> = new BehaviorSubject('EMPTY');

  private currentPage = 1;

  private relatedItems: any[];

  public total: number;

  onInit({
    configuration, mainState, options, titleService, communication,
  }) {
    this.communication = communication;
    this.configuration = configuration;
    this.mainState = mainState;
    this.options = options;
    this.titleService = titleService;
    this.mainState.update('headTitle', 'Arianna4View - Mappa');

    // navigation update
    this.mainState.updateCustom('currentNav', 'mappa');

    this.communication.request$('getMapObjects').subscribe((response) => {
      this.one('aw-map').update(response);
    });
  }

  onMarkerOpen({ id, label }) {
    // loading results
    this.state$.next('LOADING');
    this.communication.request$('getEntityRelatedItems', {
      params: {
        selectedEntitiesIds: [id]
      }
    }).subscribe(({ itemsPagination }) => {
      // clear loading
      this.state$.next('SUCCESS');

      this.relatedItems = itemsPagination.items;
      this.total = this.relatedItems.length;
      let text = `<strong>${this.total}</strong> Risultati collegati a<br><span class="aw-multimedia__results-title-big">${label}</span>`;
      if (this.total === 1) {
        text = `<strong>${this.total}</strong> Risultato collegato a<br><span class="aw-multimedia__results-title-big">${label}</span>`;
      }

      const titleData: InnerTitleData = {
        title: {
          main: { text },
        },
        actions: {
          buttons: [{
            anchor: {
              href: `${this.configuration.get('paths').entitaBasePath}/${id}/${helpers.slugify(label)}`,
            },
            text: 'Vedi Entità'
          }]
        }
      };
      this.one('aw-scheda-inner-title').update(titleData);

      // update items
      this.updateItems();

      // update pagination
      this.updatePagination();
    });
  }

  onMarkerClose() {
    // reset
    this.state$.next('EMPTY');
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
        label: 'Numero di risultati',
        list: [10, 25, 50],
        active: this.pageSize,
      },
    });
  }
}

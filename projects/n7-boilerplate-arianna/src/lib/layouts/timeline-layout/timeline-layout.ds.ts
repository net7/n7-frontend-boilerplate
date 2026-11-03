import { InnerTitleData } from '@net7/components';
import { LayoutDataSource } from '@net7/core';
import { isNull } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { helpers } from '@net7/boilerplate-common';
import { getHeadTitle } from '../../helpers/title.helper';

type LayoutState = 'LOADING' | 'EMPTY' | 'SUCCESS';

export class AwTimelineLayoutDS extends LayoutDataSource {
  protected configuration: any;

  protected mainState: any;

  protected titleService: any;

  public configId = 'timeline-layout';

  public options: any;

  public pageTitle: string;

  private communication: any;

  private pageSize = 10;

  public state$: BehaviorSubject<LayoutState> = new BehaviorSubject('EMPTY');

  private currentPage = 1;

  private relatedItems: any[];

  public total: number;

  private currentId: string;

  onInit({
    configuration, mainState, options, titleService, communication,
  }) {
    this.communication = communication;
    this.configuration = configuration;
    this.mainState = mainState;
    this.options = options;
    this.titleService = titleService;

    // head title
    this.setHeadTitle();
    this.setPageTitle();

    // navigation update
    this.mainState.updateCustom('currentNav', 'timeline');

    this.communication.request$('getEventObjects', {
      params: {},
      onError: (err) => {
        console.warn(err);
      }
    }).subscribe((response) => {
      this.one('aw-timeline').updateOptions({
        configuration: this.configuration.get(this.configId)?.timeline
      });
      this.one('aw-timeline').update(response);
    });
  }

  onTimelineClick({ id, label, dateText }) {
    if (isNull(id)) {
      this.currentId = null;
      this.clearResults();
    } else {
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
            secondary: dateText ? {
              text: dateText
            } : null
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
  }

  private clearResults() {
    if (!this.relatedItems) {
      return;
    }
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

  private setHeadTitle() {
    this.mainState.update('headTitle', getHeadTitle({
      name: this.configuration.get('customer'),
      pageName: this.configuration.get(this.configId)?.pageName,
      pageDefault: 'Timeline',
    }));
  }

  private setPageTitle() {
    const title = this.configuration.get(this.configId)?.pageName;
    this.pageTitle = (title) || 'Gli eventi dell\'archivio';
  }
}

import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { isNull } from 'lodash';
import { BehaviorSubject } from 'rxjs';

type LayoutState = 'LOADING' | 'EMPTY' | 'SUCCESS';

const timelineMock = [
  {
    id: 'c67b3a8b-5ec9-4c82-b77c-6142e49cfad4',
    content: 'Mostra internazionale di edilizia ospedaliera, Roma (1935)',
    start: '1935'
  },
  {
    id: 'b788bca1-ce11-4618-b283-a654d16b4a10',
    content: 'Mostra di edilizia ospedaliera, Fiuggi',
    start: '1942'
  },
  {
    id: '5dae76e3-7bde-46e5-8371-a689e38378a4',
    content: 'I Congresso mondiale di sociologia',
    start: '1951'
  }
];

export class AwTimelineLayoutDS extends LayoutDataSource {
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

  private currentId: string;

  onInit({
    configuration, mainState, options, titleService, communication,
  }) {
    this.communication = communication;
    this.configuration = configuration;
    this.mainState = mainState;
    this.options = options;
    this.titleService = titleService;
    this.mainState.update('headTitle', 'Arianna4View - Timeline');

    // navigation update
    this.mainState.updateCustom('currentNav', 'timeline');

    this.communication.request$('getEventObjects', {
      params: {},
      onError: (err) => {
        console.warn(err);

        // FIXME: togliere
        this.one('aw-timeline').update(timelineMock);
      }
    }).subscribe((response) => {
      this.one('aw-timeline').update(response);
    });
  }

  onTimelineClick({ id, label }) {
    if (isNull(id)) {
      this.currentId = null;
      this.clearResults();
    } else {
      // loading results
      this.state$.next('LOADING');
      this.communication.request$('getEntityDetails', {
        params: {
          entityId: id,
        }
      }).subscribe(({ relatedItems }) => {
        // clear loading
        this.state$.next('SUCCESS');

        this.relatedItems = relatedItems;
        this.total = relatedItems.length;
        let text = `<strong>${this.total}</strong> Oggetti culturalicollegati a<br><span class="aw-multimedia__results-title-big">${label}</span>`;
        if (this.total === 1) {
          text = `<strong>${this.total}</strong> Oggetto culturale collegato a<br><span class="aw-multimedia__results-title-big">${label}</span>`;
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
        list: [10, 25, 50],
        active: this.pageSize,
      },
    });
  }
}

import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { MAP_RESULTS } from './map-mock';

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

    this.one('aw-scheda-inner-title').update({
      title: {
        main: {
          text: '1.252 Oggetti culturali collegati a Firenze'
        }
      }
    });

    this.one('aw-linked-objects').updateOptions({
      context: 'map',
      config: this.configuration,
      page: 1,
      // pagination: true,
      // paginationParams: this._getPaginationParams(),
      // dynamicPagination: {
      //   total: totalCount,
      // },
      size: 10,
    });
    this.one('aw-linked-objects').update(MAP_RESULTS);
  }
}

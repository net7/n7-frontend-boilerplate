import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { MAP_RESULTS } from '../map-layout/map-mock';

export class AwTimelineLayoutDS extends LayoutDataSource {
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
    this.mainState.update('headTitle', 'Arianna4View - Timeline');

    this.one('aw-scheda-inner-title').update({
      title: {
        main: {
          text: '<strong>68</strong> Oggetti culturali collegati a "V Congresso mondiale di sociologia, Washington D.C. (1962)"'
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

import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';

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
  }
}

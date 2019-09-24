import { LayoutDataSource } from '@n7-frontend/core';

export class AwEntitaLayoutDS extends LayoutDataSource {
  protected configuration: any;
  protected mainState: any;
  protected router: any;
  protected titleService: any;

  public options: any;
  public pageTitle: string;

  private communication: any;

  onInit({ configuration, mainState, router, options, titleService, communication }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.router = router;
    this.titleService = titleService;
    this.options = options;
    this.communication = communication;

    this.communication.request$('getEntityDetails', {
      onError: (error) => console.log(error),
      params: { entityId: "test" }
    }).subscribe((response) => {
      console.log('apollo-response', { response })
    });

  }
}
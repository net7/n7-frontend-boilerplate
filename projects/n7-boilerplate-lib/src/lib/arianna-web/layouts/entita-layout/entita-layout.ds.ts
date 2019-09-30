import { LayoutDataSource } from '@n7-frontend/core';
import { promise } from 'protractor';

export class AwEntitaLayoutDS extends LayoutDataSource {
  protected configuration: any;
  protected mainState: any;
  protected router: any;
  protected titleService: any;

  public options: any;
  public pageTitle: string;
  public myResponse: any; // store response object

  private communication: any;

  onInit({ configuration, mainState, router, options, titleService, communication }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.router = router;
    this.titleService = titleService;
    this.options = options;
    this.communication = communication;

    // this.communication.request$('getEntityDetails', {
    //   onError: (error) => console.log(error),
    //   params: { entityId: "test" }
    // }).subscribe((response) => {
    //   console.log('apollo-response', { response })
    // });
  }

  getNavigation(id) {
    /**
     * Requests data from communication provider
     * 
     * @param id - the id of the item to get
     * @returns the response of getEntityDetails with entityId === id
     */
    console.log('stai navigando a: ' + id)
    return this.communication.request$('getEntityDetails', {
      onError: (error) => console.error(error),
      params: { entityId: id }
    })
  }

  updateWidgets(data) {
    /**
     * Updates the widgets on this layout, based on route
     * 
     * @param data - communication reponse object
     */

    console.log('data obj: ', {data})

    const navigation: any = { items: [
      {
        text: 'OVERVIEW',
        payload: 'overview',
      },
      {
        text: 'CAMPI',
        payload: 'overview',
      },
      {
        text: 'OGGETTI COLLEGATI',
        payload: 'overview',
      },
      {
        text: 'ENTITA COLLEGATE',
        payload: 'overview',
      },
      {
        text: 'MAXXI',
        payload: 'overview',
      },
      {
        text: 'WIKIPEDIA',
        payload: 'overview',
      },
    ],
      payload: 'entita-nav'
  }

    this.one('aw-entita-nav').update(navigation)
  }

  loadItem(id) {
    /**
     * Loads the data for the selected nav item, into the adjacent text block.
     * 
     * @param id - id of item to request
     */
    if (id) { return (
      this.communication.request$('getEntityDetails', {
        onError: error => console.error(error),
        params: {entityId: id}
      })
    )}
    else {
      this.pageTitle = 'Entità Test'
    }
  }

  loadContent(response) {
    console.log(response)
  }
}
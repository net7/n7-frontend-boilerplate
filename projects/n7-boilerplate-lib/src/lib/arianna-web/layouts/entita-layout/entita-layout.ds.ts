import { LayoutDataSource } from '@n7-frontend/core';

export class AwEntitaLayoutDS extends LayoutDataSource {
  protected configuration: any;
  protected mainState: any;
  protected router: any;
  protected titleService: any;

  public options: any;
  public pageTitle: string;

  public myResponse: any = {}; // backend response object
  public selectedTab: string; // selected nav item
  public navHeader: any = {}; // nav-header (custom) data
  public currentId: string; // selected entity (url param)
  public currentPage: any; // pagination value (url param)

  private communication: any;

  onInit({ configuration, mainState, router, options, titleService, communication }) {
    this.communication = communication;
    this.configuration = configuration;
    this.mainState     = mainState;
    this.options       = options;
    this.router        = router;
    this.titleService  = titleService;
  }

  getNavigation(id) {
    /*
      Requests data from communication provider
     */
    return this.communication.request$('getEntityDetails', {
      onError: (error) => console.error(error),
      params: { entityId: id }
    })
  }

  updateWidgets(data) {
    /*
      Updates the widgets on this layout, based on route
    */
    this.one('aw-entita-nav').update( 'some data' )
  }

  loadItem(id, tab) {
    /*
      Loads the data for the selected nav item, into the adjacent text block.
    */
    if (id && tab) { 
      this.currentId = id // store selected item from url
      this.selectedTab = tab // store selected tab from url
      return this.communication.request$('getEntityDetails', {
        onError: error => console.error(error),
        params: {entityId: id}
      })
    }
    else {
      this.pageTitle = 'Entità Test'
    }
  }

  loadContent(res) {
    console.log('Apollo responded with: ', {res})
    this.myResponse = res
    this.navHeader = { // always render nav header
      icon: this.configuration.get("config-keys")[this.myResponse.entity.typeOfEntity.configKey].icon,
      text: this.myResponse.entity.label
    }
    switch (this.selectedTab) { // make dynamic content depending on request
      case 'overview': {
        this.one('aw-entita-metadata-viewer').updateOptions({ context: this.selectedTab });
        this.one('aw-entita-metadata-viewer').update(res.fieldsTab);
        this.one('aw-linked-objects').updateOptions({ context: this.selectedTab, configKeys: this.configuration.get("config-keys") })
        this.one('aw-linked-objects').update(res.items);
      } break;
      
      case 'campi': {
        this.one('aw-entita-metadata-viewer').updateOptions({ context: 'campi' });
        this.one('aw-entita-metadata-viewer').update(res.fieldsTab);
      } break;

      case 'oggetti-collegati': {
        this.one('aw-linked-objects').updateOptions({ 
            context: this.selectedTab,
            configKeys: this.configuration.get("config-keys"),
            page: this.currentPage,
            size: 5,
          })
        this.one('aw-linked-objects').update(res.items);
      } break;

      case 'entita-collegate': {
        // entita
      } break;

      case 'maxxi': {
        // maxxi
      } break;

      case 'wiki': {
        // wiki
      } break;

      default:
        // the url is aw/entita/something/ ??? → unknown
        console.warn('Unhandled navigation page');
        break;
    }
  }
}
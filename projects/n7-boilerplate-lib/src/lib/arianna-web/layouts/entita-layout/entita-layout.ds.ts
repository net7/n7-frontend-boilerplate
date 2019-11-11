import { LayoutDataSource } from '@n7-frontend/core';

export class AwEntitaLayoutDS extends LayoutDataSource {
  protected configuration: any;
  protected mainState: any;
  protected router: any;
  protected location: any;
  protected titleService: any;

  public options: any;
  public pageTitle: string;

  public myResponse: any = {}; // backend response object
  public selectedTab: string; // selected nav item
  public navHeader: any = {}; // nav-header (custom) data
  public currentId: string; // selected entity (url param)
  public currentPage: any; // pagination value (url param)
  public pageSize: number = 10; // linked objects page size
  public bubblesSize: number = 10; // related entities (bubbles) page size
  public bubblesEnabled: boolean;
  public bubbleLoaded: boolean;

  private communication: any;

  onInit({ configuration, mainState, router, location, options, titleService, communication }) {
    this.communication = communication;
    this.configuration = configuration;
    this.mainState = mainState;
    this.options = options;
    this.router = router;
    this.location = location;
    this.titleService = titleService;
    this.currentId = "";
    this.currentPage = 1;
    this.bubbleLoaded = false;
    this.bubblesEnabled = this.configuration.get('features-enabled') ? this.configuration.get('features-enabled')['bubblechart'] : false;
    this.bubblesSize = this.configuration.get('entita-layout') ? this.configuration.get('entita-layout')['max-bubble-num'] : this.bubblesSize;
  }

  getNavigation(id) {
    /*
      Requests data from communication provider
     */
    return this.communication.request$('getEntityDetails', {
      onError: (error) => console.error(error),
      params: { entityId: id, entitiesListSize: this.bubblesSize }
    })
  }

  /*
    Updates selected tab on tab change
  */
  handlePageNavigation = () => {
    this.currentPage =
    this.one('aw-linked-objects').updateOptions({
      context: this.selectedTab,
      config: this.configuration,
      page: this.currentPage,
      pagination: true,
      size: this.pageSize,
    })
    this.one('aw-linked-objects').update(this.myResponse);
  };

  handleNavUpdate = tab => {
    this.selectedTab = tab
    this.updateWidgets(this.myResponse)
    const page = tab == 'oggetti-collegati' ? "/1" : "";

    if(tab == 'oggetti-collegati' ){
      this.one('aw-linked-objects').updateOptions({
        context: this.selectedTab,
        config: this.configuration,
        page: this.currentPage,
        pagination: true,
        size: this.pageSize,
      })
      this.one('aw-linked-objects').update(this.myResponse);
    } else if (tab == "overview") {
      this.one('aw-linked-objects').updateOptions({
        size: 3,
        config: this.configuration,
        context: 'entita'
      })
      this.one('aw-linked-objects').update(this.myResponse);
    }

    if(tab == "overview" || tab == "entita-collegate"){
      setTimeout( () => { this.updateBubbes(this.myResponse) } , 800 );
    }

    this.location.go(
      this.configuration.get("paths").entitaBasePath
        +
        this.currentId
        + '/'
        + tab
        + page
    )
  }

  /*
    Updates the widgets on this layout, based on route
  */
  updateWidgets(data) {
    const selected = this.selectedTab
    this.one('aw-entita-nav').update({ data, selected })
  }
  updateBubbes(data) {
    if(!this.bubbleLoaded){
      this.one('aw-bubble-chart').update(data);
      this.bubbleLoaded = true;
    }
  }

  /*
    Loads the data for the selected nav item, into the adjacent text block.
  */
  loadItem(id, tab) {
    if (id && tab) {
      this.currentId = id // store selected item from url
      this.selectedTab = tab // store selected tab from url
      return this.communication.request$('getEntityDetails', {
        onError: error => console.error(error),
        params: {entityId: id, entitiesListSize: this.bubblesSize}
      })
    }
    else {
      this.pageTitle = 'Entità Test'
    }
  }

  loadContent(res) {
    console.log('(entita) Apollo responded with: ', { res })
    this.myResponse = res
    this.navHeader = { // always render nav header
      icon: this.configuration.get("config-keys")[this.myResponse.typeOfEntity] ? this.configuration.get("config-keys")[this.myResponse.typeOfEntity].icon : "",
      text: this.myResponse.label,
      color: this.myResponse.typeOfEntity
    }

    this.one('aw-entita-nav').updateOptions({bubblesEnabled: this.bubblesEnabled});
    this.one('aw-bubble-chart').updateOptions({
      context: 'scheda',
      configKeys: this.configuration.get('config-keys'),
      bubbleContainerId: 'overviewBubbleChartContainer',
      containerId: 'bubble-chart-container-overview',
    });
    this.one('aw-entita-metadata-viewer').updateOptions({ context: this.selectedTab });
    this.one('aw-entita-metadata-viewer').update(res.fields);

    if( this.selectedTab == 'oggetti-collegati' ) {
      this.one('aw-linked-objects').updateOptions({
        context: this.selectedTab,
        config: this.configuration,
        page: this.currentPage,
        pagination: true,
        size: this.pageSize,
      })
    } else {
      this.one('aw-linked-objects').updateOptions({
        size: 3,
        config: this.configuration,
        context: 'entita'
      })
    }
    this.one('aw-linked-objects').update(res);
  }
}
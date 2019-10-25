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
  public pageSize: number = 10; // linked objects page size
  public bubblesEnabled: boolean;

  private communication: any;

  onInit({ configuration, mainState, router, options, titleService, communication }) {
    this.communication = communication;
    this.configuration = configuration;
    this.mainState = mainState;
    this.options = options;
    this.router = router;
    this.titleService = titleService;
    this.bubblesEnabled = this.configuration.get('features-enabled') ? this.configuration.get('features-enabled')['bubblechart'] : false;

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

  handleNavUpdate = tab => {
    /*
      Updates selected tab on tab change
    */
    this.selectedTab = tab
    this.updateWidgets(this.myResponse)
  }

  updateWidgets(data) {
    /*
      Updates the widgets on this layout, based on route
    */
    const selected = this.selectedTab
    this.one('aw-entita-nav').update({ data, selected })
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
        params: { entityId: id }
      })
    }
    else {
      this.pageTitle = 'Entità Test'
    }
  }

  loadContent(res) {
    console.log('Apollo responded with: ', { res })
    this.myResponse = res
    this.navHeader = { // always render nav header
      icon: this.configuration.get('config-keys')[this.myResponse.entity.typeOfEntity.configKey].icon,
      text: this.myResponse.entity.label,
      color: this.myResponse.entity.typeOfEntity.configKey
    }
    switch (this.selectedTab) { // make dynamic content depending on request
      case 'overview': {
        this.one('aw-bubble-chart').updateOptions({
          context: 'scheda',
          configKeys: this.configuration.get('config-keys'),
          bubbleContainerId: 'overviewBubbleChartContainer',
          containerId: 'bubble-chart-container-overview',
        });
        this.one('aw-entita-metadata-viewer').updateOptions({ context: this.selectedTab });
        this.one('aw-entita-metadata-viewer').update(res.fieldsTab);
        this.one('aw-linked-objects').updateOptions({ size: 3, config: this.configuration, context: 'entita' })
        this.one('aw-linked-objects').update(res);
      } break;

      case 'campi': {
        this.one('aw-entita-metadata-viewer').updateOptions({ context: this.selectedTab });
        this.one('aw-entita-metadata-viewer').update(res.fieldsTab);
      } break;

      case 'oggetti-collegati': {
        this.one('aw-linked-objects').updateOptions({
          context: this.selectedTab,
          config: this.configuration,
          page: this.currentPage,
          size: this.pageSize,
        })
        this.one('aw-linked-objects').update(res);
      } break;

      case 'entita-collegate': {
        this.one('aw-bubble-chart').updateOptions({
          context: 'scheda',
          configKeys: this.configuration.get('config-keys'),
          bubbleContainerId: 'bubbleChartContainer',
          containerId: 'bubble-chart-container',
        });
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
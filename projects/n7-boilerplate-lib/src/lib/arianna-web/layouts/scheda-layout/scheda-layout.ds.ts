import { LayoutDataSource } from '@n7-frontend/core';

export class AwSchedaLayoutDS extends LayoutDataSource {
  /**
  * If you are not using these variables (from your-layout.ts),
  * remove them from here too.
  */
  private communication: any;
  protected configuration: any;
  protected mainState: any;
  protected router: any;
  protected titleService: any;
  private allBubbles: any[] = null;
  public selectedBubbles: any[] = [];

  public options: any;
  public pageTitle: string;
  public hasBreadcrumb: boolean;
  public contentParts: any;
  public tree: any;
  public sidebarCollapsed: boolean;
  public bubbleChartSectionTitle: string;
  public similarItemsSectionTitle: string;
  public metadataSectionTitle: string;
  public hasMetadata: boolean;
  public hasBubbles: boolean;
  public bubblesEnabled: boolean;
  public hasSimilarItems: boolean;
  public imageViewerIstance: any;
  /**
  * If you are not using these variables (from your-layout.ts),
  * remove them from onInit() parameters and inside the function.
  */
  onInit({ configuration, mainState, router, options, titleService, communication }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.router = router;
    this.titleService = titleService;
    this.communication = communication;
    this.options = options;
    this.sidebarCollapsed = false;
    this.bubbleChartSectionTitle = this.configuration.get('scheda-layout')['bubble-chart']['title'];
    this.similarItemsSectionTitle = this.configuration.get('scheda-layout')['related-items']['title'];
    this.metadataSectionTitle = this.configuration.get('scheda-layout')['metadata']['title'];
    this.hasSimilarItems = false;
    this.bubblesEnabled = this.configuration.get('features-enabled') ? this.configuration.get('features-enabled')['bubblechart'] : false;

    this.mainState.update('headTitle', 'Arianna Web > Patrimonio');
    this.mainState.update('pageTitle', 'Arianna Web: patrimonio Layout');
    this.mainState.updateCustom('currentNav', 'aw/patrimonio');
  }

  getNavigation(id) {
    return this.communication.request$('getTree', {
      onError: (error) => console.error(error),
      params: { treeId: id }
    })
  }

  updateNavigation(data) {
    let header = {
      iconLeft: 'n7-icon-tree-icon',
      text: data['label'],
      iconRight: 'n7-icon-angle-left',
      classes: 'is-expanded',
      payload: 'header'
    };
    this.one('aw-sidebar-header').update(header);
  }

  loadItem(id) {
    if (id) {
      const maxSimilarItems = this.configuration.get('scheda-layout')['related-items']['max-related-items'];
      return  this.communication.request$('getNode', {
        onError: (error) => console.error(error),
        params: { id: id, maxSimilarItems: maxSimilarItems }
      })
    } else {
      /* TODO: valori statici, da prendere da config */
      this.pageTitle = 'Collezione d\'Arte';
      this.contentParts = [
        {
          type: 'text',
          title: 'Collezione d\'Arte',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi gravida sagittis pulvinar. Etiam iaculis maximus metus, id tincidunt libero auctor et. Proin tempus turpis vel erat ultrices, id vestibulum ante cursus. Vestibulum lobortis, ante at eleifend consequat, massa libero bibendum justo, id fermentum magna odio ac nulla. Cras aliquet scelerisque malesuada. Mauris congue fermentum tristique. Nulla imperdiet accumsan dui, tristique lobortis metus eleifend non. Donec quis odio massa. Cras sit amet sem eu turpis molestie blandit vitae sed nibh. Pellentesque ornare enim nisl, et efficitur ante elementum a. Ut nec ex finibus, congue libero feugiat, aliquam ante. Cras sem neque, pellentesque eget mi at, auctor vulputate tellus. Sed aliquam mi a tortor ultricies interdum. Etiam tincidunt nunc commodo nulla porttitor semper. Etiam porta lacinia libero a mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
          type: 'text',
          title: 'Centro Archivi',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi gravida sagittis pulvinar. Etiam iaculis maximus metus, id tincidunt libero auctor et. Proin tempus turpis vel erat ultrices, id vestibulum ante cursus. Vestibulum lobortis, ante at eleifend consequat, massa libero bibendum justo, id fermentum magna odio ac nulla. Cras aliquet scelerisque malesuada. Mauris congue fermentum tristique. Nulla imperdiet accumsan dui, tristique lobortis metus eleifend non. Donec quis odio massa. Cras sit amet sem eu turpis molestie blandit vitae sed nibh. Pellentesque ornare enim nisl, et efficitur ante elementum a. Ut nec ex finibus, congue libero feugiat, aliquam ante. Cras sem neque, pellentesque eget mi at, auctor vulputate tellus. Sed aliquam mi a tortor ultricies interdum. Etiam tincidunt nunc commodo nulla porttitor semper. Etiam porta lacinia libero a mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        }
      ]
    }
    /*Breadcrumb section*/
    let breadcrumbs = {
      items: []
    };
    this.one('aw-scheda-breadcrumbs').update(breadcrumbs);
  }

  loadContent(response) {
    if (response) {
      console.log('(Scheda) Apollo responded with: ', response)
      this.contentParts = [];
      let content = {};

      this.one('aw-tree').updateOptions({
        icons: this.configuration.get('scheda-layout')['tree']
      })
      /* Related Entities */
      this.one('aw-bubble-chart').updateOptions({
        context: 'scheda',
        configKeys: this.configuration.get("config-keys"),
        bubbleContainerId: 'bubbleChartContainer',
        containerId: 'bubble-chart-container',
      });

      if (response.text) {
        content['content'] = response.text;
      }
      this.contentParts.push(content);
      if (response.image) {
        const images = [{ type: 'image', url: response.image, buildPyramid: false }];
        if (!this.imageViewerIstance) {
          this.one('aw-scheda-image').update({
            viewerId: 'scheda-layout-viewer',
            _setViewer: (viewer) => {
              this.imageViewerIstance = viewer;
              viewer.open(images);
            },
          });
        } else {
          this.imageViewerIstance.open(images);
        }
      }

      let titleObj = {
        icon: response.icon,
        title: {
          main: {
            text: response.title || response.label,
            classes: 'bold',
          }
        },
        tools: response.subTitle,
        actions: {}
      };

      this.one('aw-scheda-inner-title').update(titleObj);
      
      this.hasMetadata = response.fields != null;
      this.one('aw-scheda-metadata').updateOptions({ labels: this.configuration.get("labels") });
      this.one('aw-scheda-metadata').update(response);

      /*Breadcrumb section*/
      let breadcrumbs = {
        items: []
      };

      if( response.breadcrumb ){
        response.breadcrumbs.forEach(element => {
          breadcrumbs.items.push({
            label: element.label,
            payload: element.link
          })
        });
        this.one('aw-scheda-breadcrumbs').update(breadcrumbs);
      }
    }

      if ( response.relatedItems ) {
        this.hasSimilarItems = true;
        this.one('aw-linked-objects').updateOptions({ context: 'scheda', config: this.configuration })
        this.one('aw-linked-objects').update(response);
      } else {
        this.hasSimilarItems = false;
        //this.one('aw-linked-objects').update([]);
      }
  }

  collapseSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setAllBubblesFromApolloQuery( response: any, reset?: boolean ){
    if ( !response || !response.relatedEntities ) { this.hasBubbles = false; return; }
    this.allBubbles = [];

    for ( let i = 0; i < response.relatedEntities.length; i++ ){

      const color = this.configuration.get('config-keys')[response.relatedEntities[i].entity.typeOfEntity.configKey] ? this.configuration.get('config-keys')[response.relatedEntities[i].entity.typeOfEntity.configKey]['color']['hex'] : "";

      this.allBubbles.push(
        {
          id: this.convertEntityIdToBubbleId( response.relatedEntities[i].entity.id ),
          ...response.relatedEntities[i],
          color: color
        });
    }
    this.one('aw-scheda-bubble-chart').update({
      containerId: 'bubble-chart-container',
      width: window.innerWidth / 1.8,
      bubbles: this.allBubbles,
      reset: (reset ? reset : false)
    });
  }

  private convertEntityIdToBubbleId(entityId: string): string {
    if (!entityId) return null;
    return ('B_' + entityId.replace(/-/g, '_'));
  }


}

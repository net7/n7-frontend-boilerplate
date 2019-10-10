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
  public hasSimilarItems: boolean;
  public imageViewerIstance: any;
  /**
  * If you are not using these variables (from your-layout.ts),
  * remove them from onInit() parameters and inside the function.
  */
  onInit({configuration, mainState, router, options, titleService, communication }) {
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
    this.hasBubbles = false;
  }

  getNavigation( id ) {
    return this.communication.request$('getTree', {
      onError: (error) => console.error(error),
      params: { treeId: id }
    })
  }

  updateNavigation( data ) {
    let header = {
      iconLeft: 'n7-icon-tree-icon',
      text:  data['label'],
      iconRight: 'n7-icon-angle-left',
      classes: 'is-expanded',
      payload: 'header'
    };
    this.one('aw-sidebar-header').update(header);
  }

  loadItem( id ) {
    if ( id ) {
      const maxSimilarItems = this.configuration.get('scheda-layout')['related-items']['max-related-items'];
      return  this.communication.request$('getItemDetails', {
        onError: (error) => console.error(error),
        params: { itemId: id, maxSimilarItems }
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
      if(response){
        this.contentParts = [];
        let content = {};

        if ( response.text ){
          content['content'] = response.text;
        }
        this.contentParts.push(content);
        if ( response.image ) {
          const images =  [{type: 'image', url: response.image, buildPyramid: false}];
          if( !this.imageViewerIstance ) {
            this.one('aw-scheda-image').update({
              viewerId: 'scheda-layout-viewer',
              _setViewer : (viewer) => {
                this.imageViewerIstance = viewer;
                viewer.open(images);
              },
            });
          } else {
            this.imageViewerIstance.open(images);
          }
        }

        let titleObj = {
          icon: response.item.icon,
          title: {
            main: {
              text: response.title,
              classes: 'bold',
            }
          },
          tools: response.subTitle,
          actions: {}
        };

        this.one('aw-scheda-inner-title').update(titleObj);

        /*Metadata section*/
        let group = { group: [] };

        if ( response.fields ){
          this.hasMetadata = true;
          response.fields.forEach(field => {
            let items = [];
            field.fields.forEach(item => {
              items.push( { label: item.key, value: item.value} )
            });

            group.group.push(
              {
                title: field.label,
                items: items
              }
            );
        });
      }
      this.one('aw-scheda-metadata').update(group);

      /*Breadcrumb section*/
        let breadcrumbs = {
          items: []
        };

        response.breadcrumbs.forEach(element => {
          breadcrumbs.items.push({
            label: element.label,
            payload: element.link
          })
        });
        this.one('aw-scheda-breadcrumbs').update(breadcrumbs);
      }

      /* Related Entities */
      if ( response.connectedEntities ) {
        this.hasBubbles = true;
        this.setAllBubblesFromApolloQuery(response);
      } else {
        this.hasBubbles = false;
        this.one('aw-scheda-bubble-chart').update(null);
      }

      /* Similar item */
      if ( response.similarItems ) {
        this.hasSimilarItems = true;
        this.one('aw-linked-objects').updateOptions({ context: 'scheda', configKeys: this.configuration.get("config-keys") })
        this.one('aw-linked-objects').update(response.similarItems);
      } else {
        this.hasSimilarItems = false;
        this.one('aw-linked-objects').update(null);
      }
  }

  collapseSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setAllBubblesFromApolloQuery( response: any, reset?: boolean ){
    if ( !response || !response.connectedEntities ) { return; }
    this.allBubbles = [];

    for ( let i = 0; i < response.connectedEntities.length; i++ ){

      const color = this.configuration.get('config-keys')[response.connectedEntities[i].entity.typeOfEntity.configKey] ? this.configuration.get('config-keys')[response.connectedEntities[i].entity.typeOfEntity.configKey]['color']['hex'] : "";

      this.allBubbles.push(
        {
          id: this.convertEntityIdToBubbleId( response.connectedEntities[i].entity.id ),
          ...response.connectedEntities[i],
          color: color
        });
    }
    this.one('aw-scheda-bubble-chart').update({
      containerId: 'bubble-chart-container',
      width: window.innerWidth / 1.8,
      bubbles: this.allBubbles,
      reset: ( reset ? reset : false )
    });
  }

  private convertEntityIdToBubbleId( entityId: string ): string {
    if( !entityId ) return null;
    return ( 'B_' + entityId.replace(/-/g, '_') );
  }


}

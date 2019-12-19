import { LayoutDataSource } from '@n7-frontend/core';
import { fromEvent, Subject, of, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class AwSchedaLayoutDS extends LayoutDataSource {
  static tree: any;
  private destroyed$: Subject<any> = new Subject();
  private stickyControlTrigger$: Subject<any> = new Subject();
  private communication: any;
  protected configuration: any;
  protected mainState: any;
  protected router: any;
  protected titleService: any;
  // private allBubbles: any[] = null;
  // public selectedBubbles: any[] = [];
  public options: any;
  public pageTitle: string;
  public hasBreadcrumb: boolean;
  public contentParts: any = {};
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
  public sidebarIsSticky = false;
  public treeMaxHeight = '100%';

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
    this.one('aw-bubble-chart').updateOptions({ simple: true, config: this.configuration })

    this.mainState.update('headTitle', 'Arianna Web > Patrimonio');
    this.mainState.update('pageTitle', 'Arianna Web: patrimonio Layout');
    this.mainState.updateCustom('currentNav', 'aw/patrimonio');

    // sidebar sticky control
    this._sidebarStickyControl();
  }

  onDestroy(){
    this.destroyed$.next();
  }

  getNavigation(id) {
    if (AwSchedaLayoutDS.tree) {
      return of(AwSchedaLayoutDS.tree);
    }
    return this.communication.request$('getTree', {
      onError: (error) => console.error(error),
      params: { treeId: id }
    });
  }

  setTree(tree) {
    AwSchedaLayoutDS.tree = tree;
  }
  getTree = () => AwSchedaLayoutDS.tree;

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
      return this.communication.request$('getNode', {
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
      this.contentParts = [];
      const content = {};

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

      const titleObj = {
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

      // Breadcrumb section
      const breadcrumbs = {
        items: []
      };

      if (response.breadcrumb) {
        response.breadcrumbs.forEach(element => {
          breadcrumbs.items.push({
            label: element.label,
            payload: element.link
          })
        });
        this.one('aw-scheda-breadcrumbs').update(breadcrumbs);
      }
    }

    if (response.relatedItems) {
      this.hasSimilarItems = true;
      this.one('aw-linked-objects').updateOptions({ context: 'scheda', config: this.configuration })
      this.one('aw-linked-objects').update(response);
    } else {
      this.hasSimilarItems = false;
    }

    // control sticky
    setTimeout(() => {
      this.stickyControlTrigger$.next();
    });
  }

  collapseSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private _sidebarStickyControl() {
    const source$ = fromEvent(window, 'scroll');

    merge(source$, this.stickyControlTrigger$).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      const windowTop = window.pageYOffset,
        windowBottom = window.scrollY + window.innerHeight,
        wrapper = document.getElementsByClassName('sticky-parent')[0],
        wrapperTop = wrapper['offsetTop'],
        wrapperBottom = wrapperTop + wrapper.clientHeight;

        this.sidebarIsSticky = wrapperTop <= windowTop;

        // tree height control
        if (this.sidebarIsSticky && windowBottom < wrapperBottom) {
          this.treeMaxHeight = (windowBottom - windowTop - 50) + 'px';
        } else if (this.sidebarIsSticky && windowBottom >= wrapperBottom) {
          this.treeMaxHeight = (wrapperBottom - windowTop - 50) + 'px';
        } else if (windowBottom < wrapperBottom) {
          this.treeMaxHeight = (windowBottom - wrapperTop - 50) + 'px';
        } else {
          this.treeMaxHeight = (wrapperBottom - wrapperTop - 50) + 'px';
        }
    });
  }
}

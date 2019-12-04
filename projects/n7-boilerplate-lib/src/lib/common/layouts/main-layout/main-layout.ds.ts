import { LayoutDataSource } from '@n7-frontend/core';
import tippy from 'tippy.js';
import { Subject } from 'rxjs';

export class MainLayoutDS extends LayoutDataSource {
  protected configuration: any;
  protected mainState: any;
  protected router: any;
  protected route: any;
  protected titleService: any;

  public options: any;
  public pageTitle: string;

  onInit({ configuration, mainState, router, options, titleService, route }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.router = router;
    this.route = route;
    this.titleService = titleService;
    this.options = options;
    this.mainState.addCustom('currentNav', new Subject());

    // update header
    if (this.configuration.get('header')) {
      this.one('header').update({ 'items': this.configuration.get('header') });
    }

    if (this.configuration.get('footer')) {
      this.one('footer').update({ 'items': this.configuration.get('footer') });
    }

    // main state updates
    this.mainState.get$('headTitle').subscribe(val => this.titleService.setTitle(val));
    this.mainState.get$('pageTitle').subscribe(val => this.pageTitle = val);
    this.mainState.get$('subnav').subscribe(val => this.one('subnav').update(val));
    this.mainState.get$('breadcrumbs').subscribe(val => this.one('breadcrumbs').update(val));

    this.mainState.getCustom$('currentNav').subscribe(val => this.one('header').update({ "items": this.configuration.get('header'), 'selected': val }));

    // mainState test
    /* this.mainState.addCustom('customNav', new Subject());
    this.mainState.get$('pageTitle').subscribe(val => console.log('pageTitle', val));
    this.mainState.getCustom$('customNav').subscribe(val => console.log('customNav', val));

    this.mainState.update('pageTitle', 'hola');
    this.mainState.updateCustom('customNav', {'hello': 'mundo!'});

    setTimeout(() => {
      this.mainState.update('pageTitle', 'chao');
      this.mainState.updateCustom('customNav', {'hello': 'world!'});
      console.log('has', {
        'pageSubTitle' : this.mainState.has('pageSubTitle'),
        'customNav' : this.mainState.hasCustom('customNav'),
        'customNavs' : this.mainState.has('customNavs'),
      });
    }, 5000); */
  }

  onNavigate(payload) {
    // router navigation
    if (payload.handler === 'router') {
      const { path, queryParams } = payload;

      // path control
      if (!path) throw Error('onNavigate: no path for router navigate');

      if (queryParams) {
        this.router.navigate(path, {
          relativeTo: this.route,
          queryParams: queryParams,
          queryParamsHandling: 'merge'
        });
      } else {
        this.router.navigate(path);
      }

      // on change
      this._onRouterNavigate();
    }
  }

  private _onRouterNavigate() {
    // hide tippy
    tippy.hideAll();
  }
}
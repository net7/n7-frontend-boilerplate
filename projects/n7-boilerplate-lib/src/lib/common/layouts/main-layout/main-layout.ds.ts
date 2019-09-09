import { LayoutDataSource } from '@n7-frontend/core';
import { Subject } from 'rxjs';

export class MainLayoutDS extends LayoutDataSource {
  private configuration: any;
  private mainState: any;
  private router: any;
  private currentLayout: string;

  onInit({ configuration, mainState, router }){
    this.configuration = configuration;
    this.mainState = mainState;
    this.router = router;

    // update header
    this.one('header').update(this.configuration.get('main').header);

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

  onNavigate(payload){
    // router navigation
    if(payload.handler === 'router'){
      // path control
      if(!payload.path) throw Error('onNavigate: no path for router navigate');
      this.router.navigate(payload.path);
    
    // component static navigation
    } else if(payload.handler === 'static'){
      // layout control
      if(!payload.layout) throw Error('onNavigate: no layout for static navigate');
      this.currentLayout = payload.layout;
    }
  }
}
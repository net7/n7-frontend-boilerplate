import { LayoutDataSource } from '@n7-frontend/core';
import { Subject } from 'rxjs';

export class MainLayoutDS extends LayoutDataSource {
  private configuration: any;
  private mainState: any;

  onInit({ configuration, mainState }){
    this.configuration = configuration;
    this.mainState = mainState;

    // update header
    this.one('header').update(this.configuration.get('main').header);

    // mainState test
    this.mainState.addCustom('customNav', new Subject());
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
    }, 5000);
  }
}
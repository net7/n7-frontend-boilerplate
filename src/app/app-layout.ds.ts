import { MainLayoutDS } from 'n7-boilerplate-lib';

export class AppLayoutDS extends MainLayoutDS {
  onInit({ configuration, mainState, router, options }){
    super.onInit({ configuration, mainState, router, options });
    
    console.log('options', this.options);
  }
}
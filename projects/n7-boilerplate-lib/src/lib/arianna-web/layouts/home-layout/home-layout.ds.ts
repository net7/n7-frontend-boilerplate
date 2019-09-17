import { LayoutDataSource } from '@n7-frontend/core';

export class AwHomeLayoutDS extends LayoutDataSource {
  private communication: any;
  private mainState: any;
  public test: string;
  
  onInit({ communication, mainState }){
    this.communication = communication;
    this.mainState = mainState;

    this.communication.request$('getTestHero', {
      onError: (error) => console.log(error),
      params: { title: 'quello che vuoi tu!!!' },
      // method: 'GET',
      // httpOptions: {}
    }).subscribe((response) => {
      this.one('aw-hero').update(response);
      //this.one('aw-home-hero-patrimonio').update(response);
      // this.some(['aw-hero']).update(response);
    });

    this.one('aw-home-bubble-chart').update({});

    // update streams
    this.mainState.update('headTitle', 'Arianna Web > Home');
    this.mainState.update('pageTitle', 'Arianna Web: Home Layout');
    this.mainState.update('subnav', this._getSubnav());
    this.mainState.update('breadcrumbs', this._getBreadcrumbs());
  }

  changeTestText(value){
    this.test = value;
  }

  private _getSubnav(){
    return ['home', 'results', 'single'].map(page => ({
      text: page.toUpperCase(), 
      payload: {
        source: 'navigate',
        handler: 'router',
        path: [`aw/${page}`],
        id: page
      },
      _meta: { id: page }
    }));
  }

  private _getBreadcrumbs(){
    return {
      items: [{
        label: 'Arianna Web',
        payload: {
          source: 'navigate',
          handler: 'router',
          path: [`aw/home`]
        }
      },
      {
        label: 'Home Layout',
        payload: {
          source: 'navigate',
          handler: 'router',
          path: [`aw/home`]
        }
      }] 
    };
  }
}
import { LayoutDataSource } from '@n7-frontend/core';

export class AwHomeLayoutDS extends LayoutDataSource {
  private communication: any;
  public test: string;
  
  onInit({ communication }){
    this.communication = communication;

    this.communication.request$('getTestHero', {
      onError: (error) => console.log(error),
      params: { title: 'quello che vuoi tu!!!' },
      // method: 'GET',
      // httpOptions: {}
    }).subscribe((response) => {
      this.one('aw-hero').update(response.data.getTestHero);
      // this.some(['aw-hero']).update(response.data.getTestHero);
    });
    // TODO
  }

  changeTestText(value){
    this.test = value;
  }
}
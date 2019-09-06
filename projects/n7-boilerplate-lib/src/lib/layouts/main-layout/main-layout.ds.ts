import { LayoutDataSource } from '@n7-frontend/core';

export class MainLayoutDS extends LayoutDataSource {
  private configuration: any;

  onInit({ configuration }){
    this.configuration = configuration;

    // update header
    this.one('header').update(this.configuration.get('main').header);
  }
}
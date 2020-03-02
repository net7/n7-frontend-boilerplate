import { LayoutDataSource } from '@n7-frontend/core';

export class Page404LayoutDS extends LayoutDataSource {
  public options: any;

  onInit({ options }) {
    this.options = options;
  }
}

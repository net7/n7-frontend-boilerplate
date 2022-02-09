import { LayoutDataSource } from '@net7/core';

export class Page404LayoutDS extends LayoutDataSource {
  public options: any;

  onInit({ options }) {
    this.options = options;
  }
}

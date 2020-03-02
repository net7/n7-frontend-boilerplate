import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';

export class Page404LayoutDS extends LayoutDataSource {
  public options: any;

  onInit({ options }) {
    this.options = options;
  }
}

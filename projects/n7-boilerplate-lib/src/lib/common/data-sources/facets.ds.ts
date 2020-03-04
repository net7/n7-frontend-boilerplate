import { DataSource } from '@n7-frontend/core';

export class FacetsDS extends DataSource {
  public searchModel: any;

  protected transform({ fields }) {
    const { searchModel } = this.options;
    this.searchModel = searchModel;

    return fields;
  }
}

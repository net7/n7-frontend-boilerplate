import { DataSource } from '@net7/core';

export class FacetsDS extends DataSource {
  public searchModel: any;

  protected transform({ fields }) {
    const { searchModel } = this.options;
    this.searchModel = searchModel;

    return fields;
  }
}

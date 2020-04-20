import { LayoutDataSource } from '@n7-frontend/core';
import { SearchFacetsConfig } from './search-facets-config';

export class SearchFacetsLayoutDS extends LayoutDataSource {
  public data: SearchFacetsConfig;

  onInit(payload) {
    this.data = payload.data;

    this.initInputs();
  }

  onDestroy() {
    // TODO
  }

  initInputs() {
    this.data.sections.forEach(({ header, inputs }) => {
      [header, ...inputs].forEach((input) => {
        // set id
        const widgetDataSource = this.getWidgetDataSource(input.id);
        widgetDataSource.id = input.id;
        // update data
        this.one(input.id).update(input.data);
      });
    });
  }
}

import { Subject } from 'rxjs';
import { LayoutDataSource } from '@n7-frontend/core';
import { SearchFacetsConfig } from './search-facets-config';

export class SearchFacetsLayoutDS extends LayoutDataSource {
  public data: SearchFacetsConfig;

  public ready$: Subject<void> = new Subject();

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

    // signal
    this.ready$.next();
  }

  updateInputValue(id, newValue) {
    const widgetDataSource = this.getWidgetDataSource(id);
    if (widgetDataSource) {
      widgetDataSource.setValue(newValue, true);
    }
  }

  updateInputData(id, newData) {
    const widgetDataSource = this.getWidgetDataSource(id);
    if (widgetDataSource) {
      widgetDataSource.update({
        ...widgetDataSource.input,
        ...newData
      });
    }
  }

  clearInput(id) {
    const widgetDataSource = this.getWidgetDataSource(id);
    if (widgetDataSource) {
      widgetDataSource.clear();
      widgetDataSource.setValue(widgetDataSource.value, true);
    }
  }

  clearInputs() {
    this.data.sections.forEach(({ header, inputs }) => {
      [header, ...inputs].forEach((input) => {
        this.clearInput(input.id);
      });
    });
  }
}

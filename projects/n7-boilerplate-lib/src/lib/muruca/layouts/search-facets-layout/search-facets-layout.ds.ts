import { LayoutDataSource } from '@n7-frontend/core';
import { MrSearchService } from '../../services/search.service';

export class SearchFacetsLayoutDS extends LayoutDataSource {
  private searchService: MrSearchService;

  public searchConfig;

  onInit(payload) {
    this.searchService = payload.searchService;
    this.searchConfig = this.searchService.getConfig();

    this.initInputs();
  }

  onDestroy() {
    // TODO
  }

  initInputs() {
    // set components data
    this.searchConfig.sections.forEach(({ header, inputs }) => {
      [header, ...inputs].forEach((input) => {
        // set id
        const widgetDataSource = this.getWidgetDataSource(input.id);
        widgetDataSource.id = input.id;
        // update data
        this.one(input.id).update(input.data);
      });
    });

    // signal
    this.searchService.facetsReady$.next();
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
    this.searchConfig.sections.forEach(({ header, inputs }) => {
      [header, ...inputs].forEach((input) => {
        this.clearInput(input.id);
      });
    });
  }
}

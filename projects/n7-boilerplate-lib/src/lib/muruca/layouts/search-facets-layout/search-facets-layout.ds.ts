import { LayoutDataSource } from '@n7-frontend/core';
import { MrSearchService } from '../../services/search.service';

export class SearchFacetsLayoutDS extends LayoutDataSource {
  private searchService: MrSearchService;

  private inputsDS: {
    [key: string]: any;
  } = {};

  public searchConfig;

  public facets;

  onInit(payload) {
    this.searchService = payload.searchService;
    this.searchConfig = this.searchService.getConfig();
    this.facets = this.searchConfig.facets;

    this.initInputs();
  }

  initInputs() {
    // set components data
    this.facets.sections.forEach(({ header, inputs }) => {
      [header, ...inputs]
        .filter((input) => input)
        .forEach((input) => {
          // set id
          const widgetDataSource = this.getWidgetDataSource(input.id);
          widgetDataSource.id = input.id;
          // caching DS for next updates
          this.inputsDS[input.id] = widgetDataSource;
          // first update
          widgetDataSource.update(input.data);
        });
    });
  }

  updateInputValue(id, newValue) {
    const ds = this.inputsDS[id];
    ds.setValue(newValue, ds.value !== newValue);
  }

  updateInputData(id: string, newData) {
    const ds = this.inputsDS[id];
    ds.update({
      ...ds.input,
      ...newData
    });
    // refresh selected
    ds.setValue(ds.value, true);
  }

  clearInput(id: string) {
    const ds = this.inputsDS[id];
    ds.clear();
    ds.setValue(ds.value, true);
  }

  clearInputs() {
    Object.keys(this.inputsDS).forEach((id) => {
      this.clearInput(id);
    });
  }
}

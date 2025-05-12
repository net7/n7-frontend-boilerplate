import { _t, LayoutDataSource } from '@net7/core';
import { MrSearchService } from '../../services/search.service';

export class SearchFacetsLayoutDS extends LayoutDataSource {
  private searchService: MrSearchService;

  private inputsDS: {
    [key: string]: any;
  } = {};

  public searchConfig;

  // TO CHECK
  public localeService;

  public facets;

  // TO CHECK
  public redirectPath;

  // TO CHECK
  public redirectLabel;

  onInit(payload) {
    this.searchService = payload.searchService;
    // TO CHECK
    this.localeService = payload.localeService;

    this.searchConfig = this.searchService.getConfig();
    this.facets = this.searchConfig.facets;
    this.initInputs();

    // TO CHECK
    if (this.searchConfig.facets.redirectLink) {
      this.initRedirectLink(this.searchConfig.facets.redirectLink);
    }
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
          if (input.data) {
            widgetDataSource.update(input.data);
          }
        });
    });
  }

  // TO CHECK
  initRedirectLink(redirectData) {
    const locale = this.localeService.getLocale();
    this.redirectLabel = _t(redirectData.label);
    this.redirectPath = redirectData.paths[locale];

    // const locale = this.localeService.getLocale();
    // const localPath = this.localeService.getLink(locale, 'advancedSearch');
    // this.redirectLabel = _t(redirectData.label);
    // this.redirectPath = localPath;
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

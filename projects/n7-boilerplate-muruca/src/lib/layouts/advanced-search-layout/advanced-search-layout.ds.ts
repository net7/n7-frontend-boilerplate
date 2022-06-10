import { Data, Router } from '@angular/router';
import { LayoutDataSource, _t } from '@net7/core';
import { cloneDeep, isEmpty } from 'lodash';
import { CommunicationService, ConfigurationService, MainStateService } from '@net7/boilerplate-common';
import { InputCheckboxData, InputSelectData, InputTextData } from '@net7/components';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MrFormModel } from '../../models/form.model';
import { MrLocaleService } from '../../services/locale.service';

export class MrAdvancedSearchLayoutDS extends LayoutDataSource {
  protected router: Router;

  protected configuration: ConfigurationService;

  protected communication: CommunicationService;

  protected mainState: MainStateService;

  protected localeService: MrLocaleService;

  protected routeData: Data;

  protected initialState = {};

  public pageConfig;

  public form: MrFormModel;

  onInit(payload) {
    this.router = payload.router;
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.mainState = payload.mainState;
    this.routeData = payload.routeData;
    this.localeService = payload.localeService;
    this.pageConfig = this.configuration.get(this.routeData.configId);

    // add translations
    this.addTranslations(this.pageConfig);

    let optionsReq$: Observable<unknown> = of(true);
    if (this.pageConfig.hasDynamicOptions) {
      const dynamicReq$ = this.communication.request$('advancedSearchOptions', {
        onError: (err) => {
          console.warn('Request error', err);
        }
      });
      optionsReq$ = dynamicReq$.pipe(
        tap(this.handleOptionsRequest)
      );
    }

    optionsReq$.subscribe({
      complete: () => {
        // init form
        this.form = new MrFormModel();
        // form init
        this.form.init(this.pageConfig.formConfig);
        // set initial state
        this.initialState = cloneDeep(this.form.getState());

        this.one('mr-form-wrapper-accordion').update({
          form: this.form
        });
      }
    });

    // update head title
    this.updateHeadTitle();
  }

  protected updateHeadTitle() {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, _t(pageTitle)].join(' > '));
  }

  onSubmit({ state }) {
    if (!isEmpty(state)) {
      const { resultsUrl } = this.pageConfig;
      let baseUrl = resultsUrl;
      if (typeof resultsUrl !== 'string') {
        const locale = this.localeService.getLocale();
        baseUrl = resultsUrl[locale];
      }
      const params = Object.keys(state)
        .filter((key) => !(state[key].disabled || isEmpty(state[key].value)))
        .map((key) => ({
          key,
          value: Array.isArray(state[key].value)
            ? state[key].value.join(',')
            : state[key].value
        }))
        .map(({ key, value }) => `${key}=${encodeURIComponent(value)}`);
      const url = `${baseUrl}?${params.join('&')}`;
      window.open(url, '_blank');
    }
  }

  onReset() {
    Object.keys(this.initialState).forEach((key) => {
      const inputState = cloneDeep(this.initialState[key]);
      this.form.getInput(key).setState(inputState);
    });
  }

  protected handleOptionsRequest = (response) => {
    const { formConfig } = this.pageConfig;
    Object.keys(response).forEach((key) => {
      formConfig.sections.forEach(({ inputs }) => {
        inputs.forEach((input) => {
          if (input.id === key) {
            input.data = {
              ...input.data,
              ...response[key]
            };
          }
        });
      });
    });
  };

  protected addTranslations(pageConfig) {
    const { formConfig } = pageConfig;
    // page title
    pageConfig.title = _t(pageConfig.title);
    // submit
    if (formConfig.submitButton) {
      formConfig.submitButton.label = _t(formConfig.submitButton.label);
    }
    // reset
    if (formConfig.resetButton) {
      formConfig.resetButton.label = _t(formConfig.resetButton.label);
    }
    // groups
    formConfig.groups.forEach((group) => {
      if (group.options?.label) {
        group.options.label = _t(group.options.label);
      }
    });
    // sections
    formConfig.sections.forEach((section) => {
      if (section.title) {
        section.title = _t(section.title);
      }
      if (section.description) {
        section.description = _t(section.description);
      }
      section.inputs.forEach((input) => {
        if (input.data.label) {
          input.data.label = _t(input.data.label);
        }

        if (input.data.legend) {
          input.data.legend = _t(input.data.legend);
        }

        // input text
        if (input.type === 'text') {
          if (input.data.placeholder) {
            input.data.placeholder = _t(input.data.placeholder);
          }
        }
        // input checkbox
        if (input.type === 'checkbox') {
          input.data.checkboxes.forEach((checkbox) => {
            checkbox.label = _t(checkbox.label);
          });
        }
        // input select
        if (input.type === 'select') {
          input.data.options.forEach((option) => {
            option.label = _t(option.label);
          });
        }

        // info tooltip
        if (input.info && input.data.label && ['text', 'select'].includes(input.type)) {
          const inputData = input.data as InputTextData | InputSelectData;
          (input.data as InputTextData | InputSelectData).label = [
            `<span>${inputData.label}</span>`,
            `<span class="mr-input-info n7-icon n7-icon-info-circle" alt="${_t(input.info)}"></span>`
          ].join('');
        }
        if (input.info && input.data.legend && input.type === 'checkbox') {
          const inputData = input.data as InputCheckboxData;
          (input.data as InputCheckboxData).legend = [
            `<span>${inputData.legend}</span>`,
            `<span class="mr-input-info n7-icon n7-icon-info-circle" alt="${_t(input.info)}"></span>`
          ].join('');
        }
      });
    });
  }
}

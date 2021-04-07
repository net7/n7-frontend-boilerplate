import { Router } from '@angular/router';
import { LayoutDataSource, _t } from '@n7-frontend/core';
import { cloneDeep, isEmpty } from 'lodash';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrFormModel } from '../../models/form.model';

export class MrAdvancedSearchLayoutDS extends LayoutDataSource {
  protected router: Router;

  protected configuration: ConfigurationService;

  protected mainState: MainStateService;

  protected configId: string;

  protected initialState = {};

  public pageConfig;

  public form: MrFormModel;

  onInit(payload) {
    this.router = payload.router;
    this.configuration = payload.configuration;
    this.mainState = payload.mainState;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);

    // add translations
    this.addTranslations(this.pageConfig);

    // init form
    this.form = new MrFormModel();
    // form init
    this.form.init(this.pageConfig.formConfig);
    // set initial state
    this.initialState = cloneDeep(this.form.getState());

    this.one('mr-form-wrapper-accordion').update({
      form: this.form
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
      const params = Object.keys(state)
        .filter((key) => !(state[key].disabled || isEmpty(state[key].value)))
        .map((key) => ({
          key,
          value: Array.isArray(state[key].value)
            ? state[key].value.join(',')
            : state[key].value
        }))
        .map(({ key, value }) => `${key}=${encodeURIComponent(value)}`);
      const url = `${resultsUrl}?${params.join('&')}`;
      window.open(url, '_blank');
    }
  }

  onReset() {
    Object.keys(this.initialState).forEach((key) => {
      const inputState = cloneDeep(this.initialState[key]);
      this.form.getInput(key).setState(inputState);
    });
  }

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
      });
    });
  }
}

import { LayoutDataSource, _t } from '@n7-frontend/core';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrFormModel } from '../../models/form.model';

export class MrAdvancedSearchLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private mainState: MainStateService;

  private configId: string;

  public pageConfig;

  public form: MrFormModel;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.mainState = payload.mainState;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);

    // init form
    this.form = new MrFormModel();
    // form init
    this.form.init(this.pageConfig.formConfig);

    this.one('mr-form-wrapper-accordion').update({
      form: this.form
    });

    // update head title
    this.updateHeadTitle();
  }

  private updateHeadTitle() {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, _t(pageTitle)].join(' > '));
  }

  onSubmit({ state }) {
    // do nothing
    console.warn('onSubmit: to be implemented on project', state);
  }

  onReset() {
    // do nothing
  }
}

import { LayoutDataSource, _t } from '@n7-frontend/core';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';

export class MrAdvancedSearchLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private mainState: MainStateService;

  private configId: string;

  public pageConfig;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.mainState = payload.mainState;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);

    this.one('mr-form-wrapper-accordion').update({
      config: this.pageConfig.formConfig
    });

    // update head title
    this.updateHeadTitle();
  }

  private updateHeadTitle() {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, _t(pageTitle)].join(' > '));
  }

  // onInit() {
  //   this.form = new MrFormModel();

  //   // custom input types
  //   this.form.addInputType('tag', MrInputTagDS, MrInputTagEH);

  //   // form init
  //   this.form.init(this.formConfig);

  //   const queryInput = this.form.getInput('input-1');
  //   const authorsInput = this.form.getInput('input-2');
  //   const countryInput = this.form.getInput('select-1');
  //   const checkboxInput = this.form.getInput('checkbox-1');

  //   setTimeout(() => {
  //     checkboxInput.setState({ value: [1] });
  //   }, 5000);

  //   this.form.changed$.subscribe(({ id, state }) => {
  //     const { value } = state;
  //     if (id === 'input-1') {
  //       authorsInput.setState({
  //         disabled: !(typeof value === 'string' && value.trim())
  //       });
  //       countryInput.setState({
  //         disabled: !(typeof value === 'string' && value.trim())
  //       });
  //       queryInput.setState({ value: value.replace(/a/g, '@') });
  //     }

  //     // select conditionals
  //     if (id === 'select-1') {
  //       const { options } = countryInput.output;
  //       const newData = {
  //         ...countryInput.output,
  //         options: options.map((option) => ({
  //           ...option,
  //           disabled: !!(
  //             option.value === 'francia'
  //             && value === 'germania'
  //           )
  //         }))
  //       };
  //       countryInput.run(newData);
  //     }
  //   });
  // }

  // onReset() {
  //   const inputs = this.form.getInputs();
  //   Object.keys(inputs).forEach((id) => {
  //     inputs[id].clear();
  //   });
  // }

  // onSubmit() {
  //   console.warn('form state', this.form.getState());
  // }
}

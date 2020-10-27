import { LayoutDataSource } from '@n7-frontend/core';
import { MrFormConfig } from '../../interfaces/form.interface';
import { MrFormModel } from '../../models/form.model';

export class MrAdvancedSearchLayoutDS extends LayoutDataSource {
  public form: MrFormModel;

  public formConfig: MrFormConfig = {
    sections: [{
      id: 'section-1',
      inputs: [{
        id: 'input-1',
        type: 'text',
        data: {
          id: 'input-1',
          label: 'QUERY',
          placeholder: 'Cerca in tutti i campi...',
          icon: 'n7-icon-search',
          inputPayload: 'search-input',
          enterPayload: 'search-enter',
          iconPayload: 'search-icon',
        },
        state: {
          value: '',
          disabled: false,
          hidden: false
        }
      }, {
        id: 'input-2',
        type: 'text',
        data: {
          id: 'input-2',
          label: 'AUTHORS',
          placeholder: 'Cerca tra gli autori...',
          icon: 'n7-icon-search',
          inputPayload: 'search-input',
          enterPayload: 'search-enter',
          iconPayload: 'search-icon',
        },
        state: {
          value: 'in attesa del campo padre',
          disabled: true,
          hidden: false
        }
      }]
    }]
  };

  onInit() {
    this.form = new MrFormModel(this.formConfig);

    const queryInput = this.form.getInput('input-1');
    const authorsInput = this.form.getInput('input-2');

    this.form.changed$.subscribe(({ id, state }) => {
      if (id === 'input-1') {
        const { value } = state;
        authorsInput.setState({
          disabled: !(typeof value === 'string' && value.trim())
        });
        queryInput.setState({ value: value.replace(/a/g, '@') });
      }
    });
  }

  onReset() {
    const inputs = this.form.getInputs();
    Object.keys(inputs).forEach((id) => {
      inputs[id].clear();
    });
  }

  onSubmit() {
    console.warn('form state', this.form.getState());
  }
}

import { LayoutDataSource } from '@n7-frontend/core';
import { MrFormConfig } from '../../interfaces/form.interface';
import { MrFormService } from '../../services/form.service';

export class MrAdvancedSearchLayoutDS extends LayoutDataSource {
  public form: MrFormService;

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

  onInit(payload) {
    this.form = payload.form;

    this.form.load(this.formConfig);

    const queryInput = this.form.input('input-1');
    const authorsInput = this.form.input('input-2');

    this.form.changed$.subscribe(({ id, state }) => {
      if (id === 'input-1') {
        const { value } = state;
        if (typeof value === 'string' && value.trim()) {
          authorsInput.enable();
        } else {
          authorsInput.disable();
        }
        queryInput.setValue(value.replace(/a/g, '@'));
      }
      console.warn({
        id,
        state,
        formState: this.form.getFormState()
      });
    });
  }
}

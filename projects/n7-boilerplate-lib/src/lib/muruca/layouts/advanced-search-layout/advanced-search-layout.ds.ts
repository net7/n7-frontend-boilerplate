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
          label: 'SEARCH LABEL',
          placeholder: 'Search',
          icon: 'n7-icon-search',
          inputPayload: 'search-input',
          enterPayload: 'search-enter',
          iconPayload: 'search-icon',
        },
        state: {
          value: 'hola!',
          disabled: true,
          hidden: true
        }
      }]
    }]
  };

  onInit(payload) {
    this.form = payload.form;

    this.form.load(this.formConfig);
  }
}

import { DataSource } from '@n7-frontend/core';
import { MrFormWrapperAccordionData } from '../components/form-wrapper-accordion/form-wrapper-accordion';
import { MrFormModel } from '../models/form.model';

const ICON_OPEN = 'n7-icon-angle-up';
// const ICON_CLOSE = 'n7-icon-angle-down';

export class MrFormWrapperAccordionDS extends DataSource {
  protected transform(data: MrFormWrapperAccordionData): MrFormWrapperAccordionData {
    const { config, form } = data;
    if (!form) {
      data.form = new MrFormModel();
      // form init
      data.form.init(config);
    }

    // headers
    data.config.groups = config.groups.map((group) => ({
      ...group,
      options: {
        ...group.options,
        text: group.options.label,
        payload: group.id,
        iconRight: group.options.iconOpen || ICON_OPEN
      }
    }));
    return data;
  }
}

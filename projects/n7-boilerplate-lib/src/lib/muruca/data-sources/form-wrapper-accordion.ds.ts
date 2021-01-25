import { DataSource } from '@n7-frontend/core';
import { MrFormWrapperAccordionData } from '../components/form-wrapper-accordion/form-wrapper-accordion';

const ICON_OPEN = 'n7-icon-angle-up';
const ICON_CLOSE = 'n7-icon-angle-down';

export class MrFormWrapperAccordionDS extends DataSource {
  protected transform(data: MrFormWrapperAccordionData): MrFormWrapperAccordionData {
    const { form } = data;
    const { groups } = form.config;

    // set accordion headers
    data.form.config.groups = groups.map((group) => ({
      ...group,
      options: {
        ...group.options,
        text: group.options.label,
        payload: group.id,
        iconRight: group.options.isOpen ? ICON_OPEN : ICON_CLOSE,
        isOpen: group.options.isOpen
      }
    }));
    return data;
  }

  toggleGroup(groupId) {
    this.output.form.config.groups.forEach((group) => {
      if (group.id === groupId) {
        const { isOpen } = group.options;
        group.options.iconRight = isOpen ? ICON_CLOSE : ICON_OPEN;
        group.options.isOpen = !group.options.isOpen;
      }
    });
  }
}

import { DataSource } from '@net7/core';
import { MrMetadataDS } from './metadata.ds';

const ICON_OPEN = 'n7-icon-angle-up';
const ICON_CLOSE = 'n7-icon-angle-down';

export class MrMetadataDynamicDS extends DataSource {
  private metadataDS = new MrMetadataDS();

  id: string;

  protected transform(data: any): any {
    if (!data) return null;

    // set accordion headers and options
    data.data = data.data.map((group, index) => ({
      ...group,
      groupId: index,
      options: {
        ...group.options,
        text: group.title,
        label: group.title,
        payload: index,
        isOpen: group?.options?.isOpen ?? index === 0,
        showHeader: true,
        iconRight: (group?.options?.isOpen ?? index === 0) ? ICON_OPEN : ICON_CLOSE,
      }
    }));
    data.data.forEach((group, i) => {
      data.data[i].group = this.metadataDS.transform(data.data[i]);
    });

    // If a fragment (#id) is present in the url, open the related accordion
    this.options.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const fragmentGroup = data.data.find((group) => group.accordionId === fragment);
        if (fragmentGroup) {
          fragmentGroup.options.isOpen = true;
        }
      }
    });

    return data;
  }

  public toggleGroup(payload) {
    this.output.data.forEach((group) => {
      if (group.groupId === payload) {
        const { options } = group;
        const { isOpen } = options;
        options.iconRight = isOpen ? ICON_CLOSE : ICON_OPEN;
        options.isOpen = !isOpen;
      }
    });
  }
}

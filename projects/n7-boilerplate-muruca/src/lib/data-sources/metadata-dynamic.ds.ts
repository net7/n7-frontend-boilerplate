import { DataSource } from '@net7/core';
import { MrMetadataDS } from './metadata.ds';

const ICON_OPEN = 'n7-icon-angle-up';
const ICON_CLOSE = 'n7-icon-angle-down';

export class MrMetadataDynamicDS extends DataSource {
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
        isOpen: index === 0,
        showHeader: true,
        iconRight: index === 0 ? ICON_OPEN : ICON_CLOSE,
      }
    }));
    return data;
  }

  public prepareMeta(data: any) {
    const metadataDS = new MrMetadataDS();
    return metadataDS.transform(data);
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

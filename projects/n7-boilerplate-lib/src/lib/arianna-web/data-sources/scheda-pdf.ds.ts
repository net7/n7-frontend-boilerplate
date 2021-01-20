import { DataSource } from '@n7-frontend/core';
import { PdfViewerData } from '../components';

export class AwSchedaPdfDS extends DataSource {
  private items: {
    label: string;
    url: string;
    selected: boolean;
  }[];

  protected transform(data): PdfViewerData {
    const { items } = data;
    if (!(Array.isArray(items) && items.length)) {
      return null;
    }

    this.items = items.map((item, index) => ({
      ...item,
      selected: index === 0
    }));

    // defaults
    return {
      items: this.items,
      next: 1,
      prev: null,
      currentUrl: items[0].url
    };
  }

  onChange(index) {
    this.output.next = index < (this.items.length - 1) ? index + 1 : null;
    this.output.prev = index > 0 ? index - 1 : null;
    this.output.currentUrl = this.items[index].url;
    this.items.forEach((item, itemIndex) => {
      item.selected = itemIndex === index;
    });
  }

  onLoaded() {
    this.output.classes = 'is-loaded';
  }
}

import { DataSource } from '@n7-frontend/core';
import { TagData } from '@n7-frontend/components';

export class MrAdvancedSearchTagsDS extends DataSource {
  protected transform(data): TagData[] {
    const { labels } = this.options;
    return Object.keys(data).map((key) => ({
      text: `${labels[key] || key}: ${data[key]}`
    }));
  }
}

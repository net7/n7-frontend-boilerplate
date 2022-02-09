import { DataSource, _t } from '@net7/core';
import { TagData } from '@net7/components';

export class MrAdvancedSearchTagsDS extends DataSource {
  protected transform(data): TagData[] {
    const { labels } = this.options;
    return Object.keys(data).map((key) => ({
      text: `${labels[key] || key}: ${_t(data[key])}`
    }));
  }
}

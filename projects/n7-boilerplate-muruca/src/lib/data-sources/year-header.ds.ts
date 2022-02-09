import { InnerTitleData } from '@net7/components';
import { DataSource } from '@net7/core';

export class MrYearHeaderDS extends DataSource {
  protected transform(data: InnerTitleData): InnerTitleData {
    return data;
  }
}

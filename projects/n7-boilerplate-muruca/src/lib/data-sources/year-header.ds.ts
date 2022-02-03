import { InnerTitleData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';

export class MrYearHeaderDS extends DataSource {
  protected transform(data: InnerTitleData): InnerTitleData {
    return data;
  }
}

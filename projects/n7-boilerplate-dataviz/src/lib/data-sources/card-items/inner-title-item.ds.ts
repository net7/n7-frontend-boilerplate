import { InnerTitleData } from '@net7/components';
import { DataSource } from '@net7/core';

export class InnerTitleItemDS extends DataSource {
  protected transform(data: InnerTitleData): InnerTitleData {
    return data;
  }
}

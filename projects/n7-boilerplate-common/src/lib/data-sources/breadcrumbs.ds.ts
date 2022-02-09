import { DataSource } from '@net7/core';
import { BreadcrumbsData } from '@net7/components';

export class BreadcrumbsDS extends DataSource {
  protected transform(data): BreadcrumbsData | null {
    return data;
  }
}

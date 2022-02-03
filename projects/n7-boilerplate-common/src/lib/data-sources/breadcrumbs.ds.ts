import { DataSource } from '@n7-frontend/core';
import { BreadcrumbsData } from '@n7-frontend/components';

export class BreadcrumbsDS extends DataSource {
  protected transform(data): BreadcrumbsData | null {
    return data;
  }
}

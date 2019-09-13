import { DataSource } from '@n7-frontend/core';
import { IBreadcrumbsData } from '@n7-frontend/components';

export class BreadcrumbsDS extends DataSource {
  protected transform(data): IBreadcrumbsData | null {
    return data;
  }
}
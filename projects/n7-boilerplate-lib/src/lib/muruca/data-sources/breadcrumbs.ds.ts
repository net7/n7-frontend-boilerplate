import { DataSource } from '@n7-frontend/core';
import { BreadcrumbsData } from '@n7-frontend/components';

export class MrBreadcrumbsDS extends DataSource {
  protected transform(data: any): BreadcrumbsData {
    const items = Array.isArray(data) ? data.map(({ link, title }) => ({
      label: title,
      anchor: { href: link }
    })) : [];
    return { items };
  }
}

import { DataSource } from '@n7-frontend/core';
import { PdfViewerData } from '../components';

export class AwSchedaPdfDS extends DataSource {
  protected transform(data): PdfViewerData {
    const { items } = data;
    if (!(Array.isArray(items) && items.length)) {
      return null;
    }

    return { items };
  }
}

import { DataSource } from '@net7/core';

export class MrEmbeddedContentDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    if (!data) return null;
    const iframe = `<iframe src="${data}" width="100%" height="600px"></iframe>`;
    return iframe;
  }
}

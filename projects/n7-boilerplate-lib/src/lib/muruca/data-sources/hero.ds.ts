import { DataSource } from '@n7-frontend/core';

export class MrHeroDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    const { classes } = this.options;
    return { ...data, classes: classes || '' };
  }
}

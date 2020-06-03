import { DataSource } from '@n7-frontend/core';

export class MrHeroDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    const { classes, background } = this.options;
    let back;
    let image;
    if (background) {
      back = data.image; image = false;
    } else {
      image = data.image; back = false;
    }
    return {
      ...data, classes, backgroundImage: back, image: image || ''
    };
  }
}

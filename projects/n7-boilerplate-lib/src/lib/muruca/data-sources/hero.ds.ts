import { DataSource } from '@n7-frontend/core';

export class MrHeroDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    const { classes, background } = this.options;
    const {
      text, image, title, button
    } = data;
    const backgroundImage = background ? image : null;

    return {
      text,
      title,
      classes,
      backgroundImage,
      image: backgroundImage ? image : null,
      button: button ? {
        ...button,
        anchor: {
          href: button.anchor
        }
      } : null
    };
  }
}

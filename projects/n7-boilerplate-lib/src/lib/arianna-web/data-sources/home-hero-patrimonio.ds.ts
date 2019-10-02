import { DataSource } from '@n7-frontend/core';

export class AwHomeHeroPatrimonioDS extends DataSource {

  protected transform(data) {
    const { title, backgroundImage, image, text, button } = data;

    return {
      title,
      backgroundImage,
      image,
      text,
      button: {
        text: button.text,
        payload: "naviga-patrimonio"
      }
    };
  }
}
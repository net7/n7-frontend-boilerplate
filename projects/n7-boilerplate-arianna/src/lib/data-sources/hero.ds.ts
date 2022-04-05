import { DataSource } from '@net7/core';

export class AwHeroDS extends DataSource {
  public currentInputValue = '';

  protected transform(data) {
    const {
      title, text, button, backgroundImage, input, classes
    } = data;
    return {
      title,
      text,
      backgroundImage,
      button: {
        text: button.text,
        anchor: {
          payload: 'cerca',
        },
      },
      input: {
        placeholder: input.placeholder,
        payload: 'cerca-in-maxxi',
      },
      classes,
    };
  }
}

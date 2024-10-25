import { DataSource } from '@net7/core';
import { GalleryData } from '../components/gallery/gallery';

type GalleryResponse = {
  id: string | number;
  title: string;
  thumbnail: string;
  image: string;
}[];

export class MrGalleryDS extends DataSource {
  id: string;

  numImg = 0;

  protected transform(data: GalleryResponse): GalleryData {
    if (!data) {
      return null;
    }

    this.numImg = 0;
    let index = 0;
    return {
      selected: null,
      items: data.map(({
        id, title, thumbnail, image
      }) => {
        const item = {
          id,
          title,
          thumbSrc: thumbnail,
          fullSrc: image,
          payload: id,
          index
        };
        this.numImg += 1;
        index += 1;
        return item;
      })
    };
  }

  public setSelected(itemId: number | string) {
    this.output.selected = this.output.items.find(({ id }) => id === itemId);
  }

  public removeSelected() {
    this.output.selected = null;
  }

  public changeImg(rightImg) {
    const actualIndex = this.output.selected.index;
    let newIndex;
    if (actualIndex === (this.numImg - 1) && rightImg) {
      newIndex = 0;
    } else if (actualIndex === 0 && !rightImg) {
      newIndex = this.numImg - 1;
    } else {
      newIndex = (rightImg) ? (actualIndex + 1) : (actualIndex - 1);
    }
    this.output.selected = this.output.items.find(({ index }) => index === newIndex);
  }
}

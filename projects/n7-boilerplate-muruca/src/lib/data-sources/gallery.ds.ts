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

  protected transform(data: GalleryResponse): GalleryData {
    if (!data) {
      return null;
    }

    return {
      selected: null,
      items: data.map(({
        id, title, thumbnail, image
      }) => ({
        id,
        title,
        thumbSrc: thumbnail,
        fullSrc: image,
        payload: id
      }))
    };
  }

  public setSelected(itemId: number | string) {
    this.output.selected = this.output.items.find(({ id }) => id === itemId);
  }

  public removeSelected() {
    this.output.selected = null;
  }
}

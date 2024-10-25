import { Component, Input } from '@angular/core';

export type GalleryItem = {
  id: string | number;
  thumbSrc: string;
  fullSrc: string;
  title: string;
  payload: any;
  index: number;
};

export type GalleryData = {
  selected: null | GalleryItem;
  items: GalleryItem[];
}

@Component({
  selector: 'mr-gallery',
  templateUrl: './gallery.html',
})
export class MrGalleryComponent {
  @Input() data: GalleryData;

  @Input() emit: (type: string, payload?: any) => void;

  @Input() grid: number | null;

  onClick(payload) {
    if (this.emit) {
      this.emit('click', payload);
    }
  }

  onClose() {
    if (this.emit) {
      this.emit('close');
    }
  }

  onChangeImg(rightImg) {
    this.emit('changeImg', rightImg);
  }
}

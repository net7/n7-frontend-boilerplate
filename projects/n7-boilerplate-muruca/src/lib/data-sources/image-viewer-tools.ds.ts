import { ImageViewerToolsData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';

type ImageViewerResponse = {
  thumbs: string[];
  images: {
    url: string;
    type: string;
    caption?: string;
  }[];
};

export class MrImageViewerToolsDS extends DataSource {
  id: string;

  protected transform(data: ImageViewerResponse): ImageViewerToolsData {
    if (!data) return null;

    const { thumbs } = data;
    const images = data.images.map(({ caption }, thumbindex) => ({
      caption,
      thumb: thumbs[thumbindex],
      payload: { thumbindex }
    }));

    return {
      images,
      classes: '',
      navigation: data.images.length > 7 ? {
        prev: {
          payload: 'prev',
          classes: 'n7-image-viewer-tools__thumbs-scroll-left'
        },
        next: {
          payload: 'next', // 'next'
          classes: 'n7-image-viewer-tools__thumbs-scroll-right'
        },
      } : null,
      controls: {
        description: images[0].caption ? {
          icon: 'n7-icon-info1',
          anchor: { payload: 'toggle-description' },
          isActive: false,
        } : null,
        thumbs: {
          icon: 'n7-icon-images',
          anchor: { payload: 'toggle-thumbs' },
          isActive: false,
        },
        closedescription: {
          icon: 'n7-icon-close-circle',
          anchor: { payload: 'close-description' }
        }
      },

      isVisible: {
        description: false,
        thumbnails: false,
      },
      description: images[0].caption,
      initial: 0
    };
  }

  public toggleDescription() {
    this.output.isVisible.description = !this.output.isVisible.description;
    this.output.isVisible.thumbnails = false;
    this.output.controls.description.isActive = !this.output.controls.description.isActive;
    this.output.controls.thumbs.isActive = false;
  }

  public toggleThumbs() {
    this.output.isVisible.thumbnails = !this.output.isVisible.thumbnails;
    this.output.isVisible.description = false;
    this.output.controls.thumbs.isActive = !this.output.controls.thumbs.isActive;
    if (this.output.controls.description) {
      this.output.controls.description.isActive = false;
    }
  }

  public handleThumbs(index) {
    this.output.initial = index;
    this.updateDescription();
  }

  //

  public scrollRight() {
    const thumbsStrip = document.querySelectorAll<HTMLElement>('div.n7-image-viewer-tools__thumbs-strip')[0];
    const rightArrow = document.querySelectorAll<HTMLElement>(`div.${this.output.navigation.next.classes}`)[0];
    const leftArrow = document.querySelectorAll<HTMLElement>(`div.${this.output.navigation.prev.classes}`)[0];
    const maxStrip = thumbsStrip.scrollWidth - thumbsStrip.clientWidth;
    const { scrollLeft } = thumbsStrip;

    if ((scrollLeft + 400) >= maxStrip) { // mettere value da config e.g. scrollStrength
      thumbsStrip.scrollBy({
        top: 0,
        left: +400,
        behavior: 'smooth'
      });
      rightArrow.style.opacity = '0.5';
    } else {
      thumbsStrip.scrollBy({
        top: 0,
        left: +400,
        behavior: 'smooth'
      });
    }

    if (((scrollLeft + 400) > 0)) {
      leftArrow.style.opacity = '1.0';
    }
  }

  public scrollLeft() {
    const thumbsStrip = document.querySelectorAll<HTMLElement>('div.n7-image-viewer-tools__thumbs-strip')[0];
    const rightArrow = document.querySelectorAll<HTMLElement>(`div.${this.output.navigation.next.classes}`)[0];
    const leftArrow = document.querySelectorAll<HTMLElement>(`div.${this.output.navigation.prev.classes}`)[0];
    const maxStrip = thumbsStrip.scrollWidth - thumbsStrip.clientWidth;
    const { scrollLeft } = thumbsStrip;

    if ((scrollLeft - 400) <= 0) { // mettere value da config e.g. scrollStrength
      thumbsStrip.scrollBy({
        top: 0,
        left: -400,
        behavior: 'smooth'
      });
      leftArrow.style.opacity = '0.5';
    } else {
      thumbsStrip.scrollBy({
        top: 0,
        left: -400,
        behavior: 'smooth'
      });
    }

    if (((scrollLeft - 400) < maxStrip)) {
      rightArrow.style.opacity = '1.0';
    }
  }

  //

  public handlePageChange(payload) {
    this.handleThumbs(payload.page);
  }

  public updateDescription() {
    const index = this.output.initial;
    const { images } = this.output;
    this.output.description = images[index].caption;
    if (!this.output.description) {
      this.output.controls.description = null;
    } else {
      this.output.controls.description = {
        icon: 'n7-icon-info1',
        anchor: { payload: 'toggle-description' }
      };
    }
  }
}

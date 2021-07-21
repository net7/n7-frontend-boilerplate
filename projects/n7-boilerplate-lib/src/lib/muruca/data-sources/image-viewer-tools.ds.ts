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
      controls: {
        description: {
          icon: 'n7-icon-info1',
          anchor: { payload: 'toggle-description' }
        },
        thumbs: {
          icon: 'n7-icon-images',
          anchor: { payload: 'toggle-thumbs' }
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
  }

  public toggleThumbs() {
    this.output.isVisible.thumbnails = !this.output.isVisible.thumbnails;
  }

  public handleThumbs(index) {
    this.output.initial = index;
    this.updateDescription();
  }

  public handlePageChange(payload) {
    this.handleThumbs(payload.page);
  }

  public updateDescription() {
    const index = this.output.initial;
    const { images } = this.output;
    this.output.description = images[index].caption;
  }
}

import { ImageViewerToolsData, IMAGE_VIEWER_TOOLS_MOCK } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';

export class SbImageViewerToolsDS extends DataSource {
  protected transform(): ImageViewerToolsData {
    const data = IMAGE_VIEWER_TOOLS_MOCK;
    data.images = [
      { thumb: 'http://placekitten.com/200/130', payload: { thumbindex: 0 }, caption: 'Test caption <b>#1</b>' },
      { thumb: 'http://placekitten.com/90/180', payload: { thumbindex: 1 }, caption: 'Test caption <b>#2</b>' },
      { thumb: 'http://placekitten.com/90/110', payload: { thumbindex: 2 }, caption: 'Test caption <b>#3</b>' },
    ];
    const initialDescription = data.images[data.initial].caption;
    if (initialDescription !== undefined) {
      data.description = initialDescription;
    }

    return data;
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

  public handleImageViewer(payload) {
    if (payload === 'move-right') {
      this.output.initial += 1;
    }
    if (payload === 'move-left') {
      this.output.initial -= 1;
    }
    this.updateDescription();
  }

  public updateDescription() {
    const index = this.output.initial;
    const { images } = this.output;
    this.output.description = images[index].caption;
  }
}

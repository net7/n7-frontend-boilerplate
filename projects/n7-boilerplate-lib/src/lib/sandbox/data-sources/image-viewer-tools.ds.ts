import { ImageViewerToolsData, IMAGE_VIEWER_TOOLS_MOCK } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';

export class SbImageViewerToolsDS extends DataSource {
  protected transform(): ImageViewerToolsData {
    return IMAGE_VIEWER_TOOLS_MOCK;
  }

  public toggleDescription() {
    this.output.isVisible.description = !this.output.isVisible.description;
  }

  public toggleThumbs() {
    this.output.isVisible.thumbnails = !this.output.isVisible.thumbnails;
  }
}

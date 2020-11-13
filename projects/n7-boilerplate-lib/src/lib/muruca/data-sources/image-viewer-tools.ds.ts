import { DataSource } from '@n7-frontend/core';
import { IMAGE_VIEWER_TOOLS_MOCK } from '@n7-frontend/components';
import { Subject } from 'rxjs';

export class MrImageViewerToolsDS extends DataSource {
  id: string;

  viewer: any;

  protected toolsData = undefined;

  viewerLoaded$: Subject<void> = new Subject();

  protected transform(data: any): any {
    const { thumbs } = data;

    // [TBR] Trasformazione dati da backend, originali per viewer
    const toolThumbs = [];
    let i = 0;
    thumbs.forEach(({ url, description }) => {
      toolThumbs.push({
        thumb: url,
        payload: { thumbindex: i },
        caption: description,
      });
      i += 1;
    });

    this.toolsData = IMAGE_VIEWER_TOOLS_MOCK;
    this.toolsData.images = toolThumbs;
    this.toolsData.description = toolThumbs[this.toolsData.initial].caption;
    this.toolsData.classes = '';
    this.toolsData.isVisible = {
      thumbnails: false,
      description: false
    };
    this.toolsData.initial = 0;

    return this.toolsData;
  }

  public handlePageChange(payload) {
    this.output.initial = payload.page;
    this.output.description = this.toolsData.images[payload.page].caption;
  }

  public changeDescription(index) {
    this.output.description = this.toolsData.images[index].caption;
  }

  public toggleDescription() {
    this.output.isVisible.description = !this.output.isVisible.description;
  }

  public toggleThumbnails() {
    this.output.isVisible.thumbnails = !this.output.isVisible.thumbnails;
  }
}

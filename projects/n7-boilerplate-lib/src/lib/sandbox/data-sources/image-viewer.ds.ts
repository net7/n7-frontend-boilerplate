import { ImageViewerData, IMAGE_VIEWER_MOCK } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';
import { Subject } from 'rxjs';

export class SbImageViewerDS extends DataSource {
  public viewer = null;

  public viewerLoaded$: Subject<void> = new Subject();

  protected transform(): ImageViewerData {
    const data = IMAGE_VIEWER_MOCK;
    data.images = [
      { type: 'image', url: 'http://placekitten.com/1920/1080', buildPyramid: false },
      { type: 'image', url: 'http://placekitten.com/500/600', buildPyramid: false },
      { type: 'image', url: 'http://placekitten.com/700/400', buildPyramid: false }
    ];
    data.libOptions.showReferenceStrip = false;
    data._setViewer = (viewer) => {
      this.viewer = viewer;
      this.viewerLoaded$.next();
    };
    // data._pageCallback = (eventData) => eventData;
    return data;
  }

  public changePage(index) {
    this.viewer.goToPage(index); // call to OpenSeadragon APIs
  }
}
